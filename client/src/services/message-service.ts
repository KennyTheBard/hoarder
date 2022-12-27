import axios from 'axios';
import { Id, MessageSearchForm, MessageStatus } from 'common';


export const messageService = {
   getMessages: (searchForm: MessageSearchForm) =>
      axios.post('http://localhost:8080/api/getMessages', searchForm),
   markMessages: (ids: Id[], status: MessageStatus) =>
      axios.post('http://localhost:8080/api/markMessages', {
         ids,
         status
      }),
}