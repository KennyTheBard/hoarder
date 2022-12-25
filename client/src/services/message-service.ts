import axios from 'axios';
import { Id, Pagination } from 'common';


export const messageService = {
   getMessages: (pagination?: Pagination) =>
      axios.post('http://localhost:8080/api/getMessages', {
         pagination
      }),
      ignoreMessages: (messageIds: Id[]) =>
      axios.post('http://localhost:8080/api/ignoreMessages', {
         ids: messageIds
      }),
}