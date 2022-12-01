

export class InMemoryCache<T> {

   protected cache: Record<string, T> = {};

   public store(key: string, entry: T): void {
      this.cache[key] = entry;
   }

   public async refresh(entries: Record<string, T>): Promise<void> {
      const newCache = {};
      Object.entries(entries).forEach(([key, entry]) => newCache[key] = entry);
      this.cache = newCache;
   }

   public get(key: string): T | undefined {
      return this.cache[key];
   }

   public getMulti(keys: string[]): Record<string, T> {
      return keys.reduce((acc, key) => acc[key] = this.cache[key], {});
   }
}