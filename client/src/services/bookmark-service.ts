import axios from 'axios';
import { AnonymousBookmark, WithId, Bookmark, BookmarkSearchForm } from 'common';


export const bookmarkService = {
   saveBookmark: (bookmark: AnonymousBookmark) =>
      axios.post('http://localhost:8080/api/addBookmark', bookmark),
   updateBookmark: (bookmark: WithId<Bookmark>) =>
      axios.post('http://localhost:8080/api/updateBookmark', {
         id: bookmark.id,
         bookmark: {
            ...bookmark,
            id: undefined
         }
      }),
   getBookmarks: (searchForm: BookmarkSearchForm) =>
      axios.post('http://localhost:8080/api/getBookmarks', searchForm),
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