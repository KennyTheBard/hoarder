import axios from 'axios';
import { AnonymousBookmark, Bookmark } from '../models';


export const bookmarkService = {
   saveBookmark: (bookmark: AnonymousBookmark) =>
      axios.post('http://localhost:8080/api/addBookmark', bookmark),
   getBookmarks: () =>
      axios.post('http://localhost:8080/api/getBookmarks'),
   getArchivedBookmarks: () =>
      axios.post('http://localhost:8080/api/getArchivedBookmarks'),
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