const DB_NAME = 'theme-images';
const DB_VERSION = 1;
const STORE_NAME = 'images';

let dbPromise: Promise<IDBDatabase> | null = null;

function openDB(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
  });

  return dbPromise;
}

async function executeTransaction<T>(
  mode: IDBTransactionMode,
  operation: (store: IDBObjectStore) => IDBRequest<T>
): Promise<T> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], mode);
    const store = transaction.objectStore(STORE_NAME);
    const request = operation(store);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function storeImage(filename: string, blob: Blob): Promise<void> {
  await executeTransaction('readwrite', (store) => store.put(blob, filename));
}

export async function getImage(filename: string): Promise<Blob | undefined> {
  return executeTransaction('readonly', (store) => store.get(filename));
}

export async function deleteImage(filename: string): Promise<void> {
  await executeTransaction('readwrite', (store) => store.delete(filename));
}

export async function getAllImageNames(): Promise<string[]> {
  return executeTransaction('readonly', (store) => store.getAllKeys()) as Promise<string[]>;
}

export function blobToDataURL(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Extract all local:// image references from a theme styling object
 */
function extractLocalImagePaths(obj: any, paths: Set<string> = new Set()): Set<string> {
  if (!obj) return paths;

  if (typeof obj === 'string' && obj.startsWith('local://')) {
    const filename = obj.replace('local://', '');
    paths.add(filename);
  } else if (Array.isArray(obj)) {
    obj.forEach(item => extractLocalImagePaths(item, paths));
  } else if (typeof obj === 'object') {
    Object.values(obj).forEach(value => extractLocalImagePaths(value, paths));
  }

  return paths;
}

/**
 * Clean up orphaned images from IndexedDB
 * Removes any images not referenced in the provided theme styling
 */
export async function cleanupOrphanedImages(themeStyling: any): Promise<void> {
  try {
    const allImages = await getAllImageNames();
    const referencedImages = extractLocalImagePaths(themeStyling);

    const orphanedImages = allImages.filter(filename => !referencedImages.has(filename));

    if (orphanedImages.length > 0) {
      console.log('[ImageStorage] Cleaning up orphaned images:', orphanedImages);
      await Promise.all(orphanedImages.map(filename => deleteImage(filename)));
    }
  } catch (error) {
    console.error('[ImageStorage] Failed to cleanup orphaned images:', error);
  }
}
