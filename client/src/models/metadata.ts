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

export interface GameMetadata {
   steamDetails?: SteamAppDetails;
   steamReviews?: SteamAppReviews;
}

export type BookmarkTypeSuggestion = {
   type: string;
   confidence: number;
};