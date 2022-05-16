
export type SteamAppDetails = {
   name: string;
   steam_appid: number;
   short_description: string;
   header_image: string;
   platforms?: {
      windows: boolean;
      mac: boolean;
      linux: boolean;
   };
   release_date?: {
      coming_soon: boolean;
      date: string;
   };
}

export type SteamAppReviews = {
   num_reviews: number;
   review_score: number;
   review_score_desc: string;
   total_positive: number;
   total_negative: number;
   total_reviews: number;
}

export type SteamAppEntry = {
   appid: number;
   name: string;
}