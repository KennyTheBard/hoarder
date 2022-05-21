import { BaseBookmark, GameBookmark, MovieBookmark, ShowBookmark } from './bookmark';

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

export type BookmarkTypeMetadata = TypeSpecificMetadata<GameBookmark, 'game'>
   | TypeSpecificMetadata<MovieBookmark, 'movie'>
   | TypeSpecificMetadata<ShowBookmark, 'show'>;

export type TypeSpecificMetadata<T, U extends string> = Partial<
   Pick<T, Exclude<keyof T, keyof BaseBookmark<U>>>
   & {
      title: string;
      url: string;
      imageUrl: string;
   }
>;