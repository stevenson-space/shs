import { describe, expect, it } from "vitest";
import { arrange, placeAt, rowsUsed, type Box, type Placement } from "../src/components/home/placement";

const box = (id: string, w: number, h: number): Box => ({ id, w, h });

// every cell covered by at most one item, and everything inside the grid
function assertValid(cols: number, boxes: Box[], placement: Placement) {
  const taken = new Set<string>();
  boxes.forEach((b) => {
    const spot = placement[b.id];
    expect(spot, `${b.id} has a spot`).toBeDefined();
    expect(spot.x).toBeGreaterThanOrEqual(0);
    expect(spot.x + b.w).toBeLessThanOrEqual(cols);
    for (let y = spot.y; y < spot.y + b.h; y++) {
      for (let x = spot.x; x < spot.x + b.w; x++) {
        const key = `${x},${y}`;
        expect(taken.has(key), `cell ${key} used twice`).toBe(false);
        taken.add(key);
      }
    }
  });
}

describe("arrange", () => {
  it("packs items with no saved spots in list order", () => {
    const boxes = [box("schedule", 4, 4), box("lunch", 4, 4), box("weather", 4, 2), box("events", 4, 2), box("bell", 1, 1)];
    const placement = arrange(12, boxes);

    expect(placement.schedule).toEqual({ x: 0, y: 0 });
    expect(placement.lunch).toEqual({ x: 4, y: 0 });
    expect(placement.weather).toEqual({ x: 8, y: 0 });
    expect(placement.events).toEqual({ x: 8, y: 2 });
    expect(placement.bell).toEqual({ x: 0, y: 4 });
    assertValid(12, boxes, placement);
  });

  it("keeps saved spots, gaps and all", () => {
    const boxes = [box("a", 2, 2), box("b", 1, 1)];
    const placement = arrange(12, boxes, { a: { x: 6, y: 3 }, b: { x: 11, y: 0 } });

    expect(placement).toEqual({ a: { x: 6, y: 3 }, b: { x: 11, y: 0 } });
  });

  it("moves an item whose saved spot no longer fits a narrower screen", () => {
    const boxes = [box("wide", 4, 2), box("icon", 1, 1)];
    const placement = arrange(4, boxes, { wide: { x: 8, y: 0 }, icon: { x: 0, y: 0 } });

    assertValid(4, boxes, placement);
    expect(placement.icon).toEqual({ x: 0, y: 0 });
    expect(placement.wide.y).toBeGreaterThanOrEqual(1);
  });

  it("never overlaps saved spots that collide", () => {
    const boxes = [box("a", 4, 4), box("b", 2, 2)];
    const placement = arrange(12, boxes, { a: { x: 0, y: 0 }, b: { x: 2, y: 2 } });

    assertValid(12, boxes, placement);
    expect(placement.a).toEqual({ x: 0, y: 0 });
  });
});

describe("placeAt", () => {
  it("drops an item into empty space without moving anything else", () => {
    const boxes = [box("a", 2, 2), box("b", 1, 1), box("c", 1, 1)];
    const current = { a: { x: 0, y: 0 }, b: { x: 2, y: 0 }, c: { x: 3, y: 0 } };
    const next = placeAt(12, boxes, current, "a", { x: 8, y: 5 });

    expect(next).toEqual({ a: { x: 8, y: 5 }, b: { x: 2, y: 0 }, c: { x: 3, y: 0 } });
  });

  it("pushes what it lands on to the nearest free spot", () => {
    const boxes = [box("a", 2, 2), box("b", 1, 1)];
    const current = { a: { x: 0, y: 0 }, b: { x: 5, y: 1 } };
    const next = placeAt(12, boxes, current, "a", { x: 4, y: 0 });

    assertValid(12, boxes, next);
    expect(next.a).toEqual({ x: 4, y: 0 });
    // b was right next to where it ended up
    expect(Math.abs(next.b.x - 5) + Math.abs(next.b.y - 1)).toBeLessThanOrEqual(2);
  });

  it("keeps a dropped item inside the grid", () => {
    const boxes = [box("a", 4, 2)];
    expect(placeAt(8, boxes, { a: { x: 0, y: 0 } }, "a", { x: 7, y: -3 }).a).toEqual({ x: 4, y: 0 });
  });

  it("handles an item that just grew (resize) by pushing its neighbours", () => {
    const grown = [box("a", 4, 4), box("b", 1, 1), box("c", 1, 1)];
    const current = { a: { x: 0, y: 0 }, b: { x: 2, y: 0 }, c: { x: 0, y: 3 } };
    const next = placeAt(12, grown, current, "a", current.a);

    assertValid(12, grown, next);
    expect(next.a).toEqual({ x: 0, y: 0 });
  });

  it("stays valid through many random moves", () => {
    const boxes = [box("s", 4, 4), box("l", 4, 4), box("w", 4, 2), box("e", 4, 2), box("c", 2, 2), box("p", 2, 2),
      ...Array.from({ length: 10 }, (_, i) => box(`app${i}`, 1 + (i % 2), 1))];
    let current = arrange(10, boxes);
    let seed = 7;
    const random = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };

    for (let i = 0; i < 300; i++) {
      const moving = boxes[Math.floor(random() * boxes.length)];
      current = placeAt(10, boxes, current, moving.id, { x: Math.floor(random() * 10), y: Math.floor(random() * 10) });
      assertValid(10, boxes, current);
    }

    expect(rowsUsed(boxes, current)).toBeGreaterThan(0);
  });
});
