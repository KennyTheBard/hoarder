import { Tag } from 'common';
import axios from 'axios';


export const tagService = {
   saveTag: (name: string) =>
      axios.post('http://localhost:8080/api/addTag', {
         name
      }),
   getTags: () =>
      axios.post('http://localhost:8080/api/getTags'),
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