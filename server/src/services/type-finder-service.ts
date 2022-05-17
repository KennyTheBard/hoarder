import { BookmarkService } from '.';
import { Bookmark } from '../models';
import { getHostnameForUrl, isValidHttpUrl } from '../utils';


const hostnameToTypeDictionary = {
   'store.steampowered.com': 'game',
   'www.gog.com': 'game',
   'store.epicgames.com': 'game',
   'medium.com': 'article',
   'myanimelist.net': 'anime',
   'github.com': 'tool',
   'www.npmjs.com': 'tool',
   'www.producthunt.com': 'tool',
   'www.youtube.com': 'video',
}

export class TypeFinderService {

   constructor(
      private readonly bookmarkService: BookmarkService
   ) { }

   public async findTypeForUrl(url: string): Promise<BookmarkTypeSuggestion[]> {
      if (!isValidHttpUrl(url)) {
         return []; // TODO: add TEXT bookmark type
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
      if (suggestions.length === 0) {
         return [];
      }

      const total = Object.values(suggestions).reduce((total: number, count: number) => total + count, 0);
      return Object.keys(suggestions).map((type) => ({
         type,
         confidence: suggestions[type] / total 
      }));
   }

   private getTypeByHostname(hostname: string): string | undefined {
      return hostnameToTypeDictionary[hostname];
   }

}

export type BookmarkTypeSuggestion = {
   type: string;
   confidence: number;
};