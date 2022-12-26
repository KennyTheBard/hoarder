import axios from 'axios';
import { Id, Pagination } from 'common';


export const messageService = {
   getMessages: (pagination?: Pagination) =>
      axios.post('http://localhost:8080/api/getMessages', {
         pagination
      }),
   markMessagesAsIgnored: (messageIds: Id[]) =>
      axios.post('http://localhost:8080/api/markMessagesAsIgnored', {
         ids: messageIds
      }),
   markMessagesAsBookmarked: (messageIds: Id[]) =>
      axios.post('http://localhost:8080/api/markMessagesAsBookmarked', {
         ids: messageIds
      }),
}