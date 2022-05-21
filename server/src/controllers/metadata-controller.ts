import { BookmarkTypeSuggestion, GameDurationCandidate, GameMetadata, Metadata } from '../models';
import { GameMetadataService, MetadataService, MovieMetadataService, TypeFinderService } from '../services';


export class MetadataController {

   constructor(
      private readonly typeFinderService: TypeFinderService,
      private readonly metadataService: MetadataService,
      private readonly gameMetadataService: GameMetadataService,
      private readonly movieMetadataService: MovieMetadataService,
   ) { }

   public getUrlMetadata = async (request: GetUrlMetadataRequest)
      : Promise<GetUrlMetadataResponse> => {
      const metadata = await this.metadataService.getMetadata(request.url);
      return {
         metadata
      };
   }

   public getTypeSuggestions = async (request: GetTypeSuggestionsRequest)
      : Promise<GetTypeSuggestionsResponse> => {
      const suggestions = await this.typeFinderService.findTypeForUrl(request.url);
      return {
         suggestions
      };
   }

   public getGameDurationCandidates = async (request: GetGameDurationCandidatesRequest)
      : Promise<GetGameDurationCandidatesResponse> => {
      const candidates = await this.gameMetadataService.getGameDurationCandidates(request.title);
      return {
         candidates
      };
   }

   public getGameMetadataCandidates = async (request: GetGameMetadataCandidatesRequest)
      : Promise<GetGameMetadataCandidatesResponse> => {
      const candidates = await this.gameMetadataService.getGameMetadataCandidates(request.title);
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


export type GetTypeSuggestionsRequest = {
   url: string;
}

export type GetTypeSuggestionsResponse = {
   suggestions: BookmarkTypeSuggestion[];
}

export type GetGameDurationCandidatesRequest = {
   title: string;
}

export type GetGameDurationCandidatesResponse = {
   candidates: GameDurationCandidate[];
}

export type GetGameMetadataCandidatesRequest = {
   title: string;
}

export type GetGameMetadataCandidatesResponse = {
   candidates: GameMetadata[];
}