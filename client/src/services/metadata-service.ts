import axios from 'axios';


export const metadataService = {
   getUrlMetadata: (url: string) =>
      axios.post('http://localhost:8080/api/getUrlMetadata', {
         url
      }),
   getGameDurationCandidates: (gameTitle: string) =>
      axios.post('http://localhost:8080/api/getGameDurationCandidates', {
         title: gameTitle
      }),
   getMetadataCandidates: (bookmarkType: string, gameTitle: string) =>
      axios.post('http://localhost:8080/api/getMetadataCandidates', {
         type: bookmarkType,
         title: gameTitle
      }),
   getTypeSuggestions: (url: string) =>
      axios.post('http://localhost:8080/api/getTypeSuggestions', {
         url
      }),
}