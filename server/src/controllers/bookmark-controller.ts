import { BookmarkService } from '../services';
import { Bookmark } from '../models';
import { getHostnameForUrl } from '../utils';

export class BookmarkController {

   constructor(
      private readonly bookmarkService: BookmarkService
   ) { }

   public addBookmark = async (request: AddBookmarkRequest): Promise<AddBookmarkResponse> => {
      const now = new Date().getTime();
      const hostname = getHostnameForUrl(request.url);
      const savedId = await this.bookmarkService.addBookmark({
         ...request,
         hostname,
         createdTimestamp: now,
         updatedTimestamp: now
      });
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

export type AddBookmarkRequest = {
   type: string,
   title: string,
   note: string;
   url: string;
   imageUrl?: string;
   tags: string[];
};

export type AddBookmarkResponse = {
   id: string;
};

export type GetBookmarksRequest = Partial<{
   type: string;
   tags: string[];
}>;

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