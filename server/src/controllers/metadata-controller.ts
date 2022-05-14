import { GameDurationCandidate, Metadata } from '../models';
import { GameMetadataService, MetadataService } from '../services';


export class MetadataController {

   constructor(
      private readonly metadataService: MetadataService,
      private readonly gameMetadataService: GameMetadataService,
   ) { }

   public getUrlMetadata = async (request: GetUrlMetadataRequest)
      : Promise<GetUrlMetadataResponse> => {
      const metadata = await this.metadataService.getMetadata(request.url);
      return {
         metadata
      };
   }

   public getGameDurationCandidates = async (request: GetGameDurationCandidatesRequest)
      : Promise<GetGameDurationCandidatesResponse> => {
      const candidates = await this.gameMetadataService.getGameDurationCandidates(request.name);
      return {
         candidates
      };
   }

}

export type GetUrlMetadataRequest = {
   url: string;
}

export type GetUrlMetadataResponse = {
   metadata: Metadata;
}

export type GetGameDurationCandidatesRequest = {
   name: string;
}

export type GetGameDurationCandidatesResponse = {
   candidates: GameDurationCandidate[];
}