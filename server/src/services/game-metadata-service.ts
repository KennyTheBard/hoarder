import { HowLongToBeatService, HowLongToBeatEntry } from 'howlongtobeat';
import { GameDurationCandidate } from '../models';


export class GameMetadataService {
   private readonly hltbService: HowLongToBeatService;

   constructor() {
      this.hltbService = new HowLongToBeatService();
   }

   public async getGameDurationCandidates(gameName: string): Promise<Array<GameDurationCandidate>> {
      const games = await this.hltbService.search(gameName);

      return games.map((game: HowLongToBeatEntry) => ({
         name: game.name,
         imageUrl: game.imageUrl,
         duration: {
            main: game.gameplayMain,
            extra: game.gameplayMainExtra,
            completionist: game.gameplayCompletionist
         }
      }));
   }

}