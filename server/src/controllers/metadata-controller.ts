import { Metadata, BookmarkTypeSuggestion, GameDurationCandidate, CandidateMetadata, BookmarkType } from 'common';
import { CandidateMetadataCache } from '../cache';
import { GameCandidatesService, MetadataService, MediaCandidatesService, TypeFinderService, OpenLibraryService } from '../services';


export class MetadataController {

   constructor(
      private readonly typeFinderService: TypeFinderService,
      private readonly metadataService: MetadataService,
      private readonly gameMetadataService: GameCandidatesService,
      private readonly mediaMetadataService: MediaCandidatesService,
      private readonly openLibraryService: OpenLibraryService,
      private readonly candidateMetadataCache: CandidateMetadataCache,
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

   public getMetadataCandidates = async (request: GetMetadataCandidatesRequest)
      : Promise<GetMetadataCandidatesResponse> => {
      let candidates = null;
      if (!(<any>Object).values(BookmarkType).includes(request.type)) {
         return {
            candidates
         };
      }
      const type = request.type as BookmarkType;

      // check cache
      const cachedResponse = this.candidateMetadataCache.get(
         this.candidateMetadataCache.computeKey({
            query: request.title,
            type,
            candidates
         })
      );
      if (cachedResponse) {
         return {
            candidates: cachedResponse.candidates,
         }
      }

      // retrieve candidates by type
      switch (type) {
         case 'game':
            candidates = await this.gameMetadataService.getGameMetadataCandidates(request.title);
            break;
         case 'movie':
            candidates = await this.mediaMetadataService.getMovieCandidates(request.title);
            break;
         case 'show':
            candidates = await this.mediaMetadataService.getShowCandidates(request.title);
            break;
         case 'anime':
            candidates = await this.mediaMetadataService.getAnimeCandidates(request.title);
            break;
         case 'book':
            candidates = await this.openLibraryService.getBookCandidates(request.title);
            break;
      }

      // save to cache
      this.candidateMetadataCache.store({
         query: request.title,
         type,
         candidates
      })

      return candidates;
   }

   public getVideoDurationInSeconds = async (request: GetVideoDurationInSecondsRequest)
      : Promise<GetVideoDurationInSecondsResponse> => {
      return {
         durationInSeconds: await this.mediaMetadataService.getVideoDurationInSeconds(request.url)
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

export type GetMetadataCandidatesRequest = {
   type: string;
   title: string;
}

export type GetMetadataCandidatesResponse = {
   candidates: CandidateMetadata[] | null;
}

export type GetVideoDurationInSecondsRequest = {
   url: string;
}

export type GetVideoDurationInSecondsResponse = {
   durationInSeconds: number;
}