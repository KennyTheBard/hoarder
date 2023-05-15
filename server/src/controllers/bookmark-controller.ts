import { AnonymousBookmark, BookmarkType, BookmarkSearchForm, Bookmark, getHostnameForUrl, WithTotal, WithId, Id, WithPagination } from 'common';
import { BookmarkService, TagService } from '../services';

export class BookmarkController {

   constructor(
      private readonly bookmarkService: BookmarkService,
      private readonly tagService: TagService,
   ) { }

   public addBookmark = async (request: AnonymousBookmark): Promise<AddBookmarkResponse> => {
      const now = new Date().getTime();
      const hostname = getHostnameForUrl(request.url);
      const savedId = await this.bookmarkService.addBookmark({
         ...request,
         hostname,
         isArchived: false,
         createdTimestamp: now,
         updatedTimestamp: now
      });
      return {
         id: savedId
      };
   }

   public getBookmarks = async (request: GetBookmarksRequest): Promise<GetBookmarksResponse> => {
      const result = await this.bookmarkService.getBookmarks(request);
      return {
         ...result,
         pagination: request.pagination
      }
   }

   public updateBookmark = async (request: UpdateBookmarkRequest): Promise<void> => {
      await this.bookmarkService.updateBookmark(request.id, request.bookmark);
   }

   public deleteBookmark = async (request: DeleteBookmarkRequest): Promise<void> => {
      await this.bookmarkService.deleteBookmark(request.id);
   }

   public updateIsArchivedForBookmark = async (request: UpdateIsArchivedForBookmarkRequest): Promise<void> => {
      await this.bookmarkService.archiveBookmark(request.id, request.isArchived);
   }
}

export type AddBookmarkRequest = {
   type: BookmarkType,
   title: string,
   note: string;
   url: string;
   imageUrl?: string;
   tags: Id[];
};

export type AddBookmarkResponse = {
   id: string;
};

export type GetBookmarksRequest = BookmarkSearchForm;

export type GetBookmarksResponse = WithPagination<WithTotal<WithId<Bookmark>>>;

export type UpdateBookmarkRequest = {
   id: string;
   bookmark: Partial<Bookmark>;
};

export type DeleteBookmarkRequest = {
   id: string;
};

export type SendBookmarkToTelegramRequest = {
   id: string;
};

export type UpdateIsArchivedForBookmarkRequest = {
   id: string;
   isArchived: boolean;
};
