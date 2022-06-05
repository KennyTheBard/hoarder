import { AnimeBookmark, ArticleBookmark, BaseBookmark, BookmarkType, GameBookmark, GameDuration, MovieBookmark, ShowBookmark, ToolBookmark, UnknownTypeBookmark, VideoBookmark } from './bookmark';

export type MetadataComplete = {
   images: string[];
   meta: {
      description?: string;
      title?: string;
   };
   og: {
      image?: string;
      description?: string;
      title?: string;
      site_name?: string;
      type?: string;
      url?: string;
   };
}

export interface Metadata {
   url: string;
   title: string | null;
   description: string | null;
   image: string | null;
   siteName: string | null;
   hostname: string | null;
}

export type BookmarkTypeSuggestion = {
   type: BookmarkType;
   confidence: number;
};

export type GameDurationCandidate = {
   title: string;
   imageUrl: string;
   duration: GameDuration;
}

export type TypeSpecificMetadata<T> = Pick<T, Exclude<keyof T, keyof BaseBookmark>>

export type TypeMetadata = TypeSpecificMetadata<ArticleBookmark>
   | TypeSpecificMetadata<ToolBookmark>
   | TypeSpecificMetadata<VideoBookmark>
   | TypeSpecificMetadata<MovieBookmark>
   | TypeSpecificMetadata<ShowBookmark>
   | TypeSpecificMetadata<AnimeBookmark>
   | TypeSpecificMetadata<GameBookmark>
   | TypeSpecificMetadata<UnknownTypeBookmark>;

export type TypeAgnosticMetadata = {
   title?: string;
   url?: string;
   imageUrl?: string;
};

export type CandidateMetadata = TypeMetadata & TypeAgnosticMetadata;
