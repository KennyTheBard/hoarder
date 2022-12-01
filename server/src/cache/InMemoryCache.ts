

export abstract class InMemoryCache<T> {

   protected cache: Record<string, T> = {};

   public store(entry: T): T | undefined {
      return this.cache[this.computeKey(entry)] = entry;
   }

   public async refresh(entries: T[]): Promise<void> {
      const newCache = {};
      entries.forEach(entry => newCache[this.computeKey(entry)] = entry);
      this.cache = newCache;
   }

   public get(key: string): T | undefined {
      return this.cache[key];
   }

   public getMulti(keys: string[]): Record<string, T> {
      return keys.reduce((acc, key) => acc[key] = this.cache[key], {});
   }

   public abstract computeKey(entity: T): string;

}