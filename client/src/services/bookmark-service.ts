import axios from 'axios';
import { Bookmark } from '../models';


export const bookmarkService = {
   saveBookmark: (bookmark: Omit<Bookmark, "createdTimestamp" | "updatedTimestamp" | "hostname">) =>
      axios.post('http://localhost:8080/api/addBookmark', bookmark),
   getBookmarks: () =>
      axios.post('http://localhost:8080/api/getBookmarks'),
   deleteBookmark: (bookmarkId: string) =>
      axios.post('http://localhost:8080/api/deleteBookmark', {
         id: bookmarkId
      }),
}