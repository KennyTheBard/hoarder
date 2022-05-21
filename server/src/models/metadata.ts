import { BaseBookmark, GameBookmark, MovieBookmark, ShowBookmark } from './bookmark';
import { SteamAppDetails, SteamAppReviews } from './steam';

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
   type: string;
   confidence: number;
};

export type TypeSpecificMetadataBase<T extends string> = {
   type: string;
}

export type BookmarkTypeMetadata = TypeSpecificMetadata<GameBookmark, 'game'>
   | TypeSpecificMetadata<MovieBookmark, 'movie'>
   | TypeSpecificMetadata<ShowBookmark, 'show'>;

type TypeSpecificMetadata<T, U extends string> = Pick<T, Exclude<keyof T, keyof BaseBookmark<U>>>;