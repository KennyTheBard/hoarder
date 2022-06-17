import { BookmarkService } from '../services';

export class ValidationController {

   constructor(
      private readonly bookmarkService: BookmarkService
   ) { }

   public isUrlAlreadyBookmarked = async (request: IsUrlAlreadyBookmarkedRequest): Promise<IsUrlAlreadyBookmarkedResponse> => {
      const bookmark = await this.bookmarkService.getBookmarkByUrl(request.url);
      return {
         alreadyBookmarked: !!bookmark
      };
   }

}

export type IsUrlAlreadyBookmarkedRequest = {
   url: string;
};

export type IsUrlAlreadyBookmarkedResponse = {
   alreadyBookmarked: boolean;
};
