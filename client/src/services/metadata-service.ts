import axios from 'axios';


export const metadataService = {
   getUrlMetadata: (url: string) =>
      axios.post('http://localhost:8080/api/getUrlMetadata', {
         url
      })
}