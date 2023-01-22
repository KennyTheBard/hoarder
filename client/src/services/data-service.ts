import axios from 'axios';


export const dataService = {
   exportData: () => axios.post('http://localhost:8080/api/exportData'),
   importData: (data: any) => axios.post('http://localhost:8080/api/importData', {
      rawData: data
   }),
}