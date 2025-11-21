import { getImage, blobToDataURL } from '@/utils/imageStorage';

type ImageCache = Record<string, string>;
type CacheUpdateCallback = (cache: ImageCache) => void;

export class ImageResolver {
  private cache: ImageCache = {};
  private loadingPromises: Map<string, Promise<void>> = new Map();
  private updateCallbacks: Set<CacheUpdateCallback> = new Set();

  /**
   * Resolve an image path to a usable URL
   * - assets:// -> /src/themes/assets/...
   * - local:// -> data URL from IndexedDB (cached)
   * - other -> returned as-is
   */
  resolve(path: string | undefined | null): string | null {
    if (!path) return null;

    if (path.startsWith('assets://')) {
      return path.replace('assets://', '/src/themes/assets/');
    }

    if (path.startsWith('local://')) {
      const filename = path.replace('local://', '');
      return this.cache[filename] || null;
    }

    return path;
  }

  /**
   * Load a local:// image from IndexedDB into cache
   * Returns a promise that resolves when loaded
   */
  async load(path: string | undefined | null): Promise<void> {
    if (!path?.startsWith('local://')) return;

    const filename = path.replace('local://', '');

    // Skip if already cached
    if (this.cache[filename]) return;

    // Skip if already loading
    if (this.loadingPromises.has(filename)) {
      return this.loadingPromises.get(filename);
    }

    // Start loading
    const loadPromise = (async () => {
      try {
        const blob = await getImage(filename);
        if (blob) {
          const dataUrl = await blobToDataURL(blob);
          this.cache = { ...this.cache, [filename]: dataUrl };
          this.notifyUpdate();
        }
      } catch (err) {
        console.error('[ImageResolver] Failed to load:', filename, err);
      } finally {
        this.loadingPromises.delete(filename);
      }
    })();

    this.loadingPromises.set(filename, loadPromise);
    return loadPromise;
  }

  /**
   * Preload multiple images
   */
  async loadAll(paths: (string | undefined | null)[]): Promise<void> {
    await Promise.all(paths.map(path => this.load(path)));
  }

  /**
   * Subscribe to cache updates
   */
  onUpdate(callback: CacheUpdateCallback): () => void {
    this.updateCallbacks.add(callback);
    // Return unsubscribe function
    return () => this.updateCallbacks.delete(callback);
  }

  /**
   * Notify all subscribers of cache update
   */
  private notifyUpdate(): void {
    this.updateCallbacks.forEach(callback => callback(this.cache));
  }

  /**
   * Get current cache (read-only)
   */
  getCache(): Readonly<ImageCache> {
    return this.cache;
  }

  /**
   * Clear cache
   */
  clear(): void {
    this.cache = {};
    this.loadingPromises.clear();
    this.notifyUpdate();
  }
}

// Global singleton instance
export const globalImageResolver = new ImageResolver();
