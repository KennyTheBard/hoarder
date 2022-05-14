import { HowLongToBeatService, HowLongToBeatEntry } from 'howlongtobeat';
import { GameDurationCandidate } from '../models';


export class GameMetadataService {
   private readonly hltbService: HowLongToBeatService;

   constructor() {
      this.hltbService = new HowLongToBeatService();
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

}