import { BookmarkService } from '../services';
import { Bookmark } from '../models';

export class BookmarkController {

   constructor(
      private readonly bookmarkService: BookmarkService
   ) { }

   public addBookmark = async (request: AddBookmarkRequest): Promise<AddBookmarkResponse> => {
      const savedId = await this.bookmarkService.addBookmark(request);
      return {
         id: savedId
      };
   }

   public getBookmarks = async (request: GetBookmarksRequest): Promise<GetBookmarksResponse> => {
      const bookmarks = await this.bookmarkService.getAllBookmarks();
      return {
         count: bookmarks.length,
         bookmarks
      }
   }

   public updateBookmark = async (request: UpdateBookmarkRequest): Promise<void> => {
      await this.bookmarkService.updateBookmark(request.id, request.bookmark);
   }

   public deleteBookmark = async (request: DeleteBookmarkRequest): Promise<void> => {
      await this.bookmarkService.deleteBookmark(request.id);
   }

}

export type AddBookmarkRequest = Bookmark;

export type AddBookmarkResponse = {
   id: string;
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
};

export type UpdateBookmarkRequest = {
   id: string;
   bookmark: Partial<Bookmark>;
};

export type DeleteBookmarkRequest = {
   id: string;
};