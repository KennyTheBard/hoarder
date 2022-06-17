import { SteamAppCache } from '../cache';
import { GameCandidatesService } from '../services';


export class RefreshSteamAppCacheCron {

   constructor(
      private readonly gameMetadataService: GameCandidatesService,
      private readonly steamAppCache: SteamAppCache
   ) { }

   public static async createAndInit(
      intervalInMs: number,
      gameMetadataService: GameCandidatesService,
      steamAppCache: SteamAppCache
   ): Promise<RefreshSteamAppCacheCron> {
      const cron = new RefreshSteamAppCacheCron(
         gameMetadataService,
         steamAppCache
      );
      cron.start(intervalInMs);
      return cron;
   }

   private start(intervalInMs: number): void {
      this.refreshCache();
      setInterval(this.refreshCache, intervalInMs);
   }

   private refreshCache = async (): Promise<void> => {
      try {
         const steamApps = await this.gameMetadataService.getSteamAppList();
         await this.steamAppCache.refresh(steamApps);
      } catch (err) {
         console.error(err);
      }
   }

}
