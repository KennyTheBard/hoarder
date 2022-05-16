import { SteamAppEntry } from '../models/steam';


export class SteamAppCache {

   private cache: Record<string, SteamAppEntry> = {};

   constructor() {}

   public async refresh(entries: SteamAppEntry[]): Promise<void> {
      this.cache = entries.reduce((acc, entry) => acc[entry.name] = entry, {})
   }

   public async get(gameName: string): Promise<SteamAppEntry | null> {
      return this.cache[gameName];
   }
   
   public async getMulti(gameNames: string[]): Promise<SteamAppEntry[]> {
      const entries = await Promise.all(gameNames.map(gameName => this.get(gameName)));
      return entries.filter(gameName => gameName);
   }

}