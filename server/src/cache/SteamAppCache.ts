import { SteamAppEntry } from 'common';
import { InMemoryCache } from '.';


export class SteamAppCache extends InMemoryCache<SteamAppEntry> {

   public computeKey(entity: SteamAppEntry): string {
      return entity.name;
   }
}