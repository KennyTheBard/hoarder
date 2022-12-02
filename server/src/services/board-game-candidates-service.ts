import { BggClient } from 'boardgamegeekclient';
import { BggSearchDto, BggThingDto } from 'boardgamegeekclient/dist/esm/dto';
import { BoardGameBookmark, TypeSpecificMetadata } from 'common';

const BGG_URL_BASE = 'https://boardgamegeek.com/boardgame';

export class BoardGameCandidatesService {

   private readonly bggClient: BggClient;

   constructor() {
      this.bggClient = BggClient.Create();
   }

   public async getBoardGameCandidate(title: string): Promise<TypeSpecificMetadata<BoardGameBookmark>[]> {
      const searchResults: BggSearchDto[] = await this.bggClient.search.query({
         query: title,
         type: ['boardgame']
      });

      const itemSet = new Set<number>();
      searchResults.forEach(result => result.items.forEach(item => itemSet.add(item.id)));

      const candidates: BggThingDto[] = await this.bggClient.thing.query({
         id: Array.from(itemSet)
      });

      return candidates
         .filter(item => item.type === 'boardgame')
         .map(item => ({
            imageUrl: item.image,
            url: `${BGG_URL_BASE}/${item.id}`,
            note: item.description,
            yearPublished: item.yearpublished,
            minPlayers: item.minplayers,
            maxPlayers: item.maxplayers,
            minPlaytime: item.minplaytime,
            maxPlaytime: item.maxplaytime,
            minAge: item.minage
         }));
   }

}