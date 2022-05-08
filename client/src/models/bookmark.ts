export type Bookmark = ArticleBookmark | ToolBookmark | VideoBookmark |
   MovieBookmark | ShowBookmark | AnimeBookmark | GameBookmark;

export type BaseBookmark<T extends string> = {
   type: T,
   title: string;
   url: string;
   tags: string[],
   createdTimestamp: number,
   updatedTimestamp: number
}

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

export type MediaBookmarkMixin = {
   isOnNetflix: boolean;
   hasPremiered: boolean;
   premieredYear?: number;
}

export type MovieBookmark = MediaBookmarkMixin & BaseBookmark<'movie'> & {
   imdbRating?: number;
}

export type ShowBookmark = MediaBookmarkMixin & BaseBookmark<'show'> & {
   imdbRating?: number;
   isFinished: boolean;
   finishedYear?: number;
   seasonCount?: number;
}

export type AnimeBookmark = MediaBookmarkMixin & BaseBookmark<'anime'> & {
   myAnimeListScore?: number;
   myAnimeListReviewCount?: number;
   isFinished: boolean;
   finishedYear?: number;
   isAdaptation: boolean;
   episodeCount?: number;
}

export type GameBookmark = BaseBookmark<'game'> & {
   url: string;
   isLaunched: boolean;
   launchYear?: number;
   platforms: GamePlatform[];
   reviews: GameReview[];
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