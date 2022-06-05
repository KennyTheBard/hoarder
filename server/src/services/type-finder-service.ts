import { BookmarkService } from '.';
import { BookmarkType, BookmarkTypeSuggestion } from '../models';
import { getHostnameForUrl, isValidHttpUrl } from '../utils';


const hostnameToTypeDictionary = {
   'store.steampowered.com': BookmarkType.GAME,
   'www.gog.com': BookmarkType.GAME,
   'store.epicgames.com': BookmarkType.GAME,
   'medium.com': BookmarkType.ARTICLE,
   'myanimelist.net': BookmarkType.ANIME,
   'github.com': BookmarkType.TOOL,
   'www.npmjs.com': BookmarkType.TOOL,
   'www.producthunt.com': BookmarkType.TOOL,
   'www.youtube.com': BookmarkType.VIDEO,
}

export class TypeFinderService {

   constructor(
      private readonly bookmarkService: BookmarkService
   ) { }

   public async findTypeForUrl(url: string): Promise<BookmarkTypeSuggestion[]> {
      if (!isValidHttpUrl(url)) {
         return [];
      }

      const hostname = getHostnameForUrl(url);

      return this.getTypeSuggestionsByHostname(hostname);
   }

   private async getTypeSuggestionsByHostname(hostname: string): Promise<BookmarkTypeSuggestion[]> {
      const typeByHostname = this.getTypeByHostname(hostname);
      if (typeByHostname) {
         return [{
            type: typeByHostname,
            confidence: 1
         }];
      }

      const suggestions = await this.bookmarkService.getTypeCountByHostname(hostname);
      if (Object.keys(suggestions).length === 0) {
         return [];
      }

      const total = Object.values(suggestions).reduce((total: number, count: number) => total + count, 0);
      return Object.keys(suggestions)
         .map((type: BookmarkType) => ({
            type,
            confidence: suggestions[type] / total
         }));
   }

   private getTypeByHostname(hostname: string): BookmarkType | undefined {
      return hostnameToTypeDictionary[hostname];
   }
}