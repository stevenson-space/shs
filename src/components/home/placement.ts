/*
  Where each item sits on the home screen grid, like Control Center: every
  item has its own spot (column x, row y, counted from 0), empty cells are
  allowed, and nothing moves unless something else is put on top of it.

  These are plain functions with no Vue in them, so they are easy to test
  (tests/home-placement.test.ts).
*/

export type Spot = { x: number; y: number };
export type Box = { id: string; w: number; h: number };
// item id -> its top-left cell
export type Placement = Record<string, Spot>;

// Which cells are taken. Rows are added as items are placed further down.
class Occupancy {
  private rows: (string | null)[][] = [];

  constructor(readonly cols: number) {}

  private row(y: number): (string | null)[] {
    while (this.rows.length <= y) this.rows.push(new Array(this.cols).fill(null));
    return this.rows[y];
  }

  get height(): number {
    return this.rows.length;
  }

  fits(x: number, y: number, w: number, h: number): boolean {
    if (x < 0 || y < 0 || x + w > this.cols) return false;
    for (let row = y; row < y + h; row++) {
      if (row >= this.rows.length) continue;
      for (let col = x; col < x + w; col++) {
        if (this.rows[row][col] !== null) return false;
      }
    }
    return true;
  }

  mark(id: string, x: number, y: number, w: number, h: number): void {
    for (let row = y; row < y + h; row++) {
      const cells = this.row(row);
      for (let col = x; col < x + w; col++) cells[col] = id;
    }
  }
}

const readingOrder = (placement: Placement) => (a: Box, b: Box): number => {
  const pa = placement[a.id];
  const pb = placement[b.id];
  return pa.y - pb.y || pa.x - pb.x;
};

// keeps a spot inside the grid for an item of width w
function clampSpot(spot: Spot, w: number, cols: number): Spot {
  return {
    x: Math.max(0, Math.min(Math.round(spot.x), Math.max(0, cols - w))),
    y: Math.max(0, Math.round(spot.y)),
  };
}

// The first free spot, reading left to right, top to bottom.
function firstFree(grid: Occupancy, box: Box): Spot {
  const w = Math.min(box.w, grid.cols);
  for (let y = 0; ; y++) {
    for (let x = 0; x + w <= grid.cols; x++) {
      if (grid.fits(x, y, w, box.h)) return { x, y };
    }
  }
}

// The free spot closest to `near` (an item pushed out of the way lands as
// close as it can to where it was).
function nearestFree(grid: Occupancy, box: Box, near: Spot): Spot {
  const w = Math.min(box.w, grid.cols);
  const lastRow = Math.max(grid.height, near.y) + box.h;
  let best: Spot | null = null;
  let bestDistance = Infinity;

  for (let y = 0; y <= lastRow; y++) {
    for (let x = 0; x + w <= grid.cols; x++) {
      if (!grid.fits(x, y, w, box.h)) continue;
      // moving down a row is a slightly bigger change than moving across
      const distance = Math.hypot(x - near.x, (y - near.y) * 1.15);
      if (distance < bestDistance) {
        best = { x, y };
        bestDistance = distance;
      }
    }
  }

  return best ?? firstFree(grid, box);
}

/*
  Turns saved spots into a complete, overlap-free placement for `cols`
  columns. Saved spots are kept whenever they still fit; anything without a
  spot (just added, or saved for a different screen width), or whose spot no
  longer fits (it grew, or the screen got narrower), goes to the first free
  spot in list order.
*/
export function arrange(cols: number, boxes: Box[], saved: Placement = {}): Placement {
  const grid = new Occupancy(cols);
  const result: Placement = {};
  const unplaced: Box[] = [];

  const withSpot = boxes.filter((box) => saved[box.id]).sort(readingOrder(saved));

  withSpot.forEach((box) => {
    const w = Math.min(box.w, cols);
    const spot = saved[box.id];

    if (spot.x + w <= cols && grid.fits(spot.x, spot.y, w, box.h)) {
      grid.mark(box.id, spot.x, spot.y, w, box.h);
      result[box.id] = { x: spot.x, y: spot.y };
    } else {
      unplaced.push(box);
    }
  });

  boxes
    .filter((box) => !saved[box.id] || unplaced.includes(box))
    .forEach((box) => {
      const spot = firstFree(grid, box);
      grid.mark(box.id, spot.x, spot.y, Math.min(box.w, cols), box.h);
      result[box.id] = spot;
    });

  return result;
}

/*
  Puts item `id` at `to` (its size may have just changed too). Everything
  it doesn't touch stays exactly where it is; anything it lands on is
  pushed to the nearest free spot.
*/
export function placeAt(cols: number, boxes: Box[], current: Placement, id: string, to: Spot): Placement {
  const box = boxes.find((entry) => entry.id === id);
  if (!box) return current;

  const w = Math.min(box.w, cols);
  const spot = clampSpot(to, w, cols);
  const grid = new Occupancy(cols);
  const result: Placement = { [id]: spot };
  grid.mark(id, spot.x, spot.y, w, box.h);

  const others = boxes.filter((entry) => entry.id !== id && current[entry.id]).sort(readingOrder(current));
  const pushed: Box[] = [];

  others.forEach((other) => {
    const at = current[other.id];
    const ow = Math.min(other.w, cols);

    if (at.x + ow <= cols && grid.fits(at.x, at.y, ow, other.h)) {
      grid.mark(other.id, at.x, at.y, ow, other.h);
      result[other.id] = { x: at.x, y: at.y };
    } else {
      pushed.push(other);
    }
  });

  pushed.forEach((other) => {
    const free = nearestFree(grid, other, current[other.id]);
    grid.mark(other.id, free.x, free.y, Math.min(other.w, cols), other.h);
    result[other.id] = free;
  });

  // anything that had no spot yet
  boxes
    .filter((entry) => !result[entry.id])
    .forEach((entry) => {
      const free = firstFree(grid, entry);
      grid.mark(entry.id, free.x, free.y, Math.min(entry.w, cols), entry.h);
      result[entry.id] = free;
    });

  return result;
}

// How many rows the placement uses.
export function rowsUsed(boxes: Box[], placement: Placement): number {
  return boxes.reduce((rows, box) => {
    const spot = placement[box.id];
    return spot ? Math.max(rows, spot.y + box.h) : rows;
  }, 0);
}
