import axios from 'axios';


export const metadataService = {
   getUrlMetadata: (url: string) =>
      axios.post('http://localhost:8080/api/getUrlMetadata', {
         url
      }),
   getMetadataCandidates: (bookmarkType: string, title: string) =>
      axios.post('http://localhost:8080/api/getMetadataCandidates', {
         type: bookmarkType,
         title: title
      }),
   getTypeSuggestions: (url: string) =>
      axios.post('http://localhost:8080/api/getTypeSuggestions', {
         url
      }),
   getVideoDurationInSeconds: (url: string) =>
      axios.post('http://localhost:8080/api/getVideoDurationInSeconds', {
         url
      }),
}