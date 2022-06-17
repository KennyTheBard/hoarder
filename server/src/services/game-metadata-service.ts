import { HowLongToBeatService, HowLongToBeatEntry } from 'howlongtobeat';
import SteamAPI from 'steamapi';
import { Collection, Db } from 'mongodb';
import _ from 'lodash';
import axios from 'axios';
import { SteamAppCache } from '../cache';
import levenshtein from 'fast-levenshtein';
import { GameDurationCandidate, SteamAppEntry, TypeSpecificMetadata, GameBookmark, TypeAgnosticMetadata, GamePlatform, SteamAppDetails, SteamAppReviews } from 'common';

export class GameMetadataService {
   private readonly collection: Collection<SteamAPI.App>;

   constructor(
      private readonly db: Db,
      private readonly steamClient: SteamAPI,
      private readonly steamAppCache: SteamAppCache,
      private readonly hltbService: HowLongToBeatService
   ) {
      this.collection = this.db.collection<SteamAPI.App>('steamApps');
   }

   public async getGameDurationCandidates(title: string): Promise<GameDurationCandidate[]> {
      try {
         const games = await this.hltbService.search(title);

         return games.map((game: HowLongToBeatEntry) => ({
            title: game.name,
            imageUrl: `http://howlongtobeat.com${game.imageUrl}`,
            duration: {
               main: game.gameplayMain,
               extra: game.gameplayMainExtra,
               completionist: game.gameplayCompletionist
            }
         }));
      } catch (e) {
         return [];
      }
   }

   // Doesn't seem used, i think i can remove it
   public async updateSteamAppList(apps: SteamAPI.App[]): Promise<void> {
      const lastAddedDocuments = await this.collection.find()
         .sort({
            appid: -1
         })
         .limit(1)
         .toArray();
      const lastAddedAppid = lastAddedDocuments.length === 0 ? 0 : lastAddedDocuments[0].appid;

      for (const batch of _.chunk(apps, 1000)) {
         // insert new apps
         const newApps = batch.filter(app => app.appid > lastAddedAppid);
         await this.collection.insertMany(newApps);

         // update existing apps
         await Promise.all(
            batch
               .filter(app => app.appid <= lastAddedAppid)
               .filter(app => this.collection.updateOne({
                  "appid": app.appid
               },
                  {
                     "$set": { ...app }
                  },
                  {
                     upsert: true
                  }))
         );
      }
   }

   public async getSteamAppList(): Promise<SteamAppEntry[]> {
      const { data } = await axios.get('https://api.steampowered.com/ISteamApps/GetAppList/v2/')
      return data.applist.apps;
   }

   public async getGameMetadataCandidates(title: string): Promise<TypeSpecificMetadata<GameBookmark>[]> {
      const suggestions = await this.getSteamGameSuggestions(title);

      return Promise.all(
         suggestions.map((suggestion: SteamAppEntry) => this.getGameMetadataByAppId(suggestion.name, suggestion.appid))
      );
   }

   public async getGameMetadataByAppId(title: string, appid: number): Promise<TypeSpecificMetadata<GameBookmark> & TypeAgnosticMetadata> {
      const details = await this.getSteamAppDetails(appid);
      const reviews = await this.getSteamAppReviews(appid);
      const durationCandidates = await this.getGameDurationCandidates(title);
      const duration = durationCandidates.length > 0 ? durationCandidates.sort((a, b) => levenshtein.get(a.title, title) - levenshtein.get(b.title, title))[0] : undefined;

      return {
         title: details.name,
         url: this.steamAppIdToSteamUrl(appid),
         imageUrl: details.header_image,
         candidateId: appid,
         steamReviews: reviews,
         platforms: [
            ...(details.platforms.windows ? [GamePlatform.WINDOWS] : []),
            ...(details.platforms.linux ? [GamePlatform.LINUX] : []),
            ...(details.platforms.mac ? [GamePlatform.MAC] : []),
         ],
         launchDate: details.release_date ? details.release_date.date : undefined,
         isLaunched: details.release_date ? !details.release_date.coming_soon : undefined,
         duration: duration !== undefined ? duration.duration : undefined,
      };
   }

   private async getSteamGameSuggestions(searchTerm: string): Promise<SteamAppEntry[]> {
      const { data } = await axios.get(`https://store.steampowered.com/search/suggest?term=${encodeURI(searchTerm)}&cc=EN`)
      const suggestions = data
         .replaceAll('<ul>', '')
         .replaceAll('</ul>', '')
         .replaceAll('<li>', '')
         .split('</li>')
         .filter((item: string) => item.length > 0);
      return this.steamAppCache.getMulti(suggestions);
   }

   private async getSteamAppDetails(appid: number): Promise<SteamAppDetails> {
      const response: any = await this.steamClient.getGameDetails(String(appid));
      return response;
   }

   private async getSteamAppReviews(appid: number): Promise<SteamAppReviews> {
      const { data } = await axios.get(`https://store.steampowered.com/appreviews/${appid}?json=1`)
      return data.query_summary;
   }

   private steamAppIdToSteamUrl(appid: number): string {
      return `https://store.steampowered.com/app/${appid}`;
   }

}