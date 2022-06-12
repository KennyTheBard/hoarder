import axios from 'axios';
import { AnonymousBookmark, Bookmark, BookmarkSearchForm } from '../models';
import { WithId } from '../utils';


export const bookmarkService = {
   saveBookmark: (bookmark: AnonymousBookmark) =>
      axios.post('http://localhost:8080/api/addBookmark', bookmark),
   updateBookmark: (bookmark: WithId<Bookmark>) =>
      axios.post('http://localhost:8080/api/updateBookmark', {
         id: bookmark._id,
         bookmark: {
            ...bookmark,
            _id: undefined
         }
      }),
   getBookmarks: (showArchived: boolean, searchForm?: BookmarkSearchForm) =>
      axios.post('http://localhost:8080/api/getBookmarks', {
         isArchived: showArchived,
         searchForm
      }),
   deleteBookmark: (bookmarkId: string) =>
      axios.post('http://localhost:8080/api/deleteBookmark', {
         id: bookmarkId
      }),
   updateIsArchivedForBookmark: (bookmarkId: string, isArchived: boolean) =>
      axios.post('http://localhost:8080/api/updateIsArchivedForBookmark', {
         id: bookmarkId,
         isArchived
      }),
}