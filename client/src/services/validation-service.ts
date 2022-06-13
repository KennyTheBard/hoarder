import axios from 'axios';


export const validationService = {
   isUrlAlreadyBookmarked: (url: string) =>
      axios.post('http://localhost:8080/api/isUrlAlreadyBookmarked', {
         url
      }),
}