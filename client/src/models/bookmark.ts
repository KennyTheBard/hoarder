export type Bookmark = ArticleBookmark | ToolBookmark | VideoBookmark |
   MovieBookmark | ShowBookmark | AnimeBookmark | GameBookmark;

export type ArticleBookmark = BaseBookmark<'article'> & {
   description: string;
}

export type ToolBookmark = BaseBookmark<'tool'> & {
   isOpenSource: boolean;
   isWebsite: boolean;
   isFree: boolean;
   hasFreeTier: boolean;
}

export type VideoBookmark = BaseBookmark<'video'> & {
   hostname: string;
   lengthInSeconds: number;
}

export type MediaBookmark = {
   isOnNetflix: boolean;
   premiered: boolean;
   premieredYear?: number;
}

export type MovieBookmark = MediaBookmark & BaseBookmark<'movie'> & {
   imdbUrl?: string;
   imdbRating?: number;
}

export type ShowBookmark = MediaBookmark & BaseBookmark<'show'> & {
   imdbUrl: string;
   imdbRating?: number;
   finished: boolean;
   finishedYear?: number;
   seasonCount?: number;
}

export type AnimeBookmark = MediaBookmark & BaseBookmark<'anime'> & {
   myAnimeListScore?: number;
   myAnimeListReviewCount?: number;
   finished: boolean;
   finishedYear?: number;
   isAdaptation: boolean;
   episodeCount?: number;
}

export type GameBookmark = BaseBookmark<'game'> & {
   url: string;
   published: boolean;
   publishedYear?: number;
   platforms: GamePlatform[];
   reviews: GameReview[];
}

export type BaseBookmark<T extends string> = {
   type: T,
   title: string;
   url: string;
   tags: string[],
   createdTimestamp: number,
   updatedTimestamp: number
}

export enum GamePlatform {
   WINDOWS = 'Windows',
   LINUX = 'Linux',
   MAC = 'MacOS',
   SWITCH = 'Nintendo Switch'
}

export type GameReview = SteamReview | GogReview;

export type SteamReview = Review<'steam'> & {
   recentReviews?: string;
   recentReviewsCount?: number;
   allReviews?: string;
   allReviewsCount?: number;
}

export type GogReview = Review<'gog'> & {
   overall?: number;
   verifiedOwners?: number;
   filtersBased?: number;
}

export type Review<T extends string> = {
   source: T
}