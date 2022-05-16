import { HowLongToBeatService, HowLongToBeatEntry } from 'howlongtobeat';
import { GameDurationCandidate } from '../models';
import SteamAPI from 'steamapi';
import { Collection, Db } from 'mongodb';
import _ from 'lodash';
import axios from 'axios';
import { SteamAppDetails, SteamAppEntry, SteamAppReviews } from '../models/steam';
import { SteamAppCache } from '../cache';

export class GameMetadataService {
   private readonly hltbService: HowLongToBeatService;
   private readonly steam: SteamAPI;
   private readonly collection: Collection<SteamAPI.App>;

   constructor(
      private readonly db: Db,
      private readonly steamAppCache: SteamAppCache
   ) {
      this.hltbService = new HowLongToBeatService();
      this.steam = new SteamAPI('');
      this.collection = this.db.collection<SteamAPI.App>('steamApps');
   }

   public async getGameDurationCandidates(title: string): Promise<Array<GameDurationCandidate>> {
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
   }

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

   public async getSteamAppDetails(appid: number): Promise<SteamAppDetails> {
      const { data } = await this.steam.getGameDetails(String(appid));
      return data[appid].data;
   }

   public async getSteamAppReviews(appid: number): Promise<SteamAppReviews> {
      const { data } = await axios.get(`https://store.steampowered.com/appreviews/${appid}?json=1`)
      return data.query_summary;
   }

   public async getSteamAppList(): Promise<SteamAppEntry[]> {
      const { data } = await axios.get('https://api.steampowered.com/ISteamApps/GetAppList/v2/')
      return data.applist.apps;
   }

   public async getSteamGameSuggestions(searchTerm: string): Promise<SteamAppEntry[]> {
      const { data } = await axios.get(`https://store.steampowered.com/search/suggest?term=${searchTerm}&cc=EN`)
      const suggestions = data
         .replace('<ul>', '')
         .replace('</ul>', '')
         .replace('<li>', '')
         .split('</li>')
         .filter((item: string) => item.length > 0);
      return this.steamAppCache.getMulti(suggestions);
   }

}