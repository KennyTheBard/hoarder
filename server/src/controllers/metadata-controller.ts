import { Metadata, BookmarkTypeSuggestion, GameDurationCandidate, CandidateMetadata, BookmarkType } from 'common';
import { GameCandidatesService, MetadataService, MediaCandidatesService, TypeFinderService, OpenLibraryService, BoardGameCandidatesService } from '../services';


export class MetadataController {

   constructor(
      private readonly typeFinderService: TypeFinderService,
      private readonly metadataService: MetadataService,
      private readonly gameMetadataService: GameCandidatesService,
      private readonly mediaMetadataService: MediaCandidatesService,
      private readonly openLibraryService: OpenLibraryService,
      private readonly boardGameCandidatesService: BoardGameCandidatesService
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
      switch (request.type) {
         case BookmarkType.GAME:
            return {
               candidates: await this.gameMetadataService.getGameMetadataCandidates(request.title)
            };
         case BookmarkType.MOVIE:
            return {
               candidates: await this.mediaMetadataService.getMovieCandidates(request.title)
            };
         case BookmarkType.SHOW:
            return {
               candidates: await this.mediaMetadataService.getShowCandidates(request.title)
            };
         case BookmarkType.ANIME:
            return {
               candidates: await this.mediaMetadataService.getAnimeCandidates(request.title)
            };
         case BookmarkType.BOOK:
            return {
               candidates: await this.openLibraryService.getBookCandidates(request.title)
            };
         case BookmarkType.BOARDGAME:
            return {
               candidates: await this.boardGameCandidatesService.getBoardGameCandidate(request.title)
            }
         default:
            return {
               candidates: null
            };
      }
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