import { SteamAppReviews } from './steam';


export enum BookmarkType {
   ARTICLE = 'article',
   TOOL = 'tool',
   VIDEO = 'video',
   MOVIE = 'movie',
   SHOW = 'show',
   ANIME = 'anime',
   GAME = 'game',

   UNKNOWN = ''
}

export type Bookmark =( ArticleBookmark
   | ToolBookmark
   | VideoBookmark
   | MovieBookmark
   | ShowBookmark
   | AnimeBookmark
   | GameBookmark
   | UnknownTypeBookmark
) & BaseBookmark;

export type BaseBookmark = {
   type: BookmarkType;
   title: string;
   note?: string;
   url: string;
   imageUrl?: string;
   tags: string[];
   hostname: string;
   isArchived: boolean;
   createdTimestamp: number;
   updatedTimestamp: number;
}

export type UnknownTypeBookmark = BaseBookmark & Partial<{
   type: BookmarkType.UNKNOWN;
}>;

export type ArticleBookmark = BaseBookmark & Partial<{
   type: BookmarkType.ARTICLE;
   description: string;
}>;

export type ToolBookmark = BaseBookmark & Partial<{
   type: BookmarkType.TOOL;
   isOpenSource: boolean;
   isWebsite: boolean;
   isFree: boolean;
   hasFreeTier: boolean;
}>;

export type VideoBookmark = BaseBookmark & Partial<{
   type: BookmarkType.VIDEO;
   durationInSeconds: number;
}>;

export type MediaBookmarkMixin = Partial<{
   isOnNetflix: boolean;
   hasPremiered: boolean;
   releaseYear: number;
}>;

export type MovieBookmark = MediaBookmarkMixin & BaseBookmark & Partial<{
   type: BookmarkType.MOVIE;
   imdbRating: number;
}>;

export type ShowBookmark = MediaBookmarkMixin & BaseBookmark & Partial<{
   type: BookmarkType.SHOW;
   imdbRating: number;
   isFinished: boolean;
   finishedYear: number;
   seasonCount: number;
}>;

export type AnimeBookmark = MediaBookmarkMixin & BaseBookmark & Partial<{
   type: BookmarkType.ANIME;
   myAnimeListScore: number;
   myAnimeListReviewCount: number;
   isFinished: boolean;
   finishedYear: number;
   isAdaptation: boolean;
   episodeCount: number;
}>;

export type GameBookmark = BaseBookmark & Partial<{
   type: BookmarkType.GAME;
   isLaunched: boolean;
   launchDate: string;
   platforms: GamePlatform[];
   steamReviews: SteamAppReviews;
   gogReviews: GogReviews;
   duration: GameDuration;
}>;

export enum GamePlatform {
   WINDOWS = 'Windows',
   LINUX = 'Linux',
   MAC = 'MacOS',
   SWITCH = 'Nintendo Switch'
}

export type GogReviews = {
   overall?: number;
   verifiedOwners?: number;
   filtersBased?: number;
}

export type GameDuration = {
   main: number;
   extra: number;
   completionist: number;
}
