import { Tag } from 'common';
import axios from 'axios';


export const tagService = {
   addTag: (name: string) =>
      axios.post('http://localhost:8080/api/addTag', {
         name
      }),
   getAllTags: () =>
      axios.post('http://localhost:8080/api/getAllTags'),
   getTagsExtended: () =>
      axios.post('http://localhost:8080/api/getTagsExtended'),
   updateTag: (payload: {
      id: string,
      tag: Tag
   }) =>
      axios.post('http://localhost:8080/api/updateTag', payload),
   deleteTags: (ids: string[]) =>
      axios.post('http://localhost:8080/api/deleteTags', {
         ids
      })
}