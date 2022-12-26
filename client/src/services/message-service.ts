import axios from 'axios';
import { Id, MessageStatus, Pagination } from 'common';


export const messageService = {
   getMessages: (pagination?: Pagination) =>
      axios.post('http://localhost:8080/api/getMessages', {
         pagination
      }),
   markMessages: (ids: Id[], status: MessageStatus) =>
      axios.post('http://localhost:8080/api/markMessages', {
         ids,
         status
      }),
}