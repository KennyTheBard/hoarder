import axios from 'axios';
import { AnonymousBookmark, BookmarkSearchForm } from '../models';


export const bookmarkService = {
   saveBookmark: (bookmark: AnonymousBookmark) =>
      axios.post('http://localhost:8080/api/addBookmark', bookmark),
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