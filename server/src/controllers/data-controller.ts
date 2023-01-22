import { DataService, RawData } from '../services';


export class DataController {

   constructor(
      private readonly dataService: DataService
   ) {}

   public exportData = async (): Promise<ExportDataResponse> => {
      const rawData = await this.dataService.exportData();
      return {
         rawData
      };
   }

}

export type ExportDataResponse = {
   rawData: RawData;
};