import { Metadata } from '../models';
import { MetadataService } from '../services';


export class MetadataController {

   constructor(
      private readonly metadataService: MetadataService
   ) {}

   public getUrlMetadata = async (request: GetUrlMetadataRequest): Promise<GetUrlMetadataResponse> => {
      const metadata = await this.metadataService.getMetadata(request.url);
      return {
         metadata
      };
   }

}

export type GetUrlMetadataRequest = {
   url: string;
}

export type GetUrlMetadataResponse = {
   metadata: Metadata;
}