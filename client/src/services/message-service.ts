import axios from 'axios';
import { Pagination } from 'common';


export const messageService = {
   getMessages: (pagination?: Pagination) =>
      axios.post('http://localhost:8080/api/getMessages', {
         pagination
      }),
}