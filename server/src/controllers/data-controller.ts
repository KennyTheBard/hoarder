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

   public importData = async (request: ImportDataRequest): Promise<void> => {
      await this.dataService.importData(request.rawData);
   }

}

export type ExportDataResponse = {
   rawData: RawData;
};

export type ImportDataRequest = {
   rawData: any;
};