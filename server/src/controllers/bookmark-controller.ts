import { BookmarkService } from '../services';
import { Bookmark } from '../models';
import { WithId } from '../utils';

export class BookmarkController {

   constructor(
      private readonly bookmarkService: BookmarkService
   ) {}

   public addBookmark = async (request: AddBookmarkRequest): Promise<AddBookmarkResponse> => {
      const savedId = await this.bookmarkService.addBookmark(request);
      return savedId ? {
         success: true,
         id: savedId
      } : {
         success: false,
         error: 'Could not add bookmark'
      };
   }

   public getBookmarks = async (request: GetBookmarksRequest): Promise<GetBookmarksResponse> => {
      const bookmarks = await this.bookmarkService.getAllBookmarks();

      return {
         count: bookmarks.length,
         bookmarks
      }
   }

   public async updateBookmark(req: Request, res: Response) {
      
   }

   public async deleteBookmark(req: Request, res: Response) {
      
   }

}

export type AddBookmarkRequest = Bookmark;

export type AddBookmarkResponse = {
   success: true;
   id: string;
} | {
   success: false;
   error: string;
};

export type GetBookmarksRequest = Partial<{
   type: string;
   tags: string[];
}> & {
   offset: number;
   limit: number;
};

export type GetBookmarksResponse = {
   count: number;
   bookmarks: Bookmark[];
}