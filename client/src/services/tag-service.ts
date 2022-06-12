import axios from 'axios';
import { Tag } from '../models';


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
   deleteTag: (id: string) =>
      axios.post('http://localhost:8080/api/deleteTag', {
         id
      })
}