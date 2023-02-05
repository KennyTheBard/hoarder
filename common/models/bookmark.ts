import { Id } from '..';
import { SteamAppReviews } from './steam';


export enum BookmarkType {
   ARTICLE = 'article',
   TOOL = 'tool',
   VIDEO = 'video',
   MOVIE = 'movie',
   SHOW = 'show',
   ANIME = 'anime',
   COMICS = 'comics',
   GAME = 'game',
   BOARDGAME = 'board game',
   PLAINTEXT = 'plaintext',
   RESOURCE = 'resource',
   BOOK = 'book',

   UNKNOWN = ''
}

export type Bookmark = (ArticleBookmark
   | ToolBookmark
   | VideoBookmark
   | MovieBookmark
   | ShowBookmark
   | AnimeBookmark
   | GameBookmark
   | UnknownTypeBookmark
   | PlainTextBookmark
   | ResourceBookmark
   | BookBookmark
   | ComicsBookmark
   | BoardGameBookmark
) & BaseBookmark;

export type BaseBookmark = {
   type: BookmarkType;
   title: string;
   note: string;
   url: string;
   imageUrl?: string;
   tags: Id[];
   hostname: string;
   isArchived: boolean;
   candidateId?: string | number;
   createdTimestamp: number;
   updatedTimestamp: number;
}

export type AnonymousBookmark = Omit<Bookmark, "createdTimestamp" | "updatedTimestamp" | "hostname" | "isArchived" | "candidateId">

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
   magnetUrl?: string;
}>;

export type BoardGameBookmark = BaseBookmark & Partial<{
   type: BookmarkType.BOARDGAME;
   yearPublished: number;
   minPlayers: number;
   maxPlayers: number;
   minPlaytime: number;
   maxPlaytime: number;
   minAge: number;
}>;

export type UnknownTypeBookmark = BaseBookmark & Partial<{
   type: BookmarkType.UNKNOWN;
}>;

export type PlainTextBookmark = BaseBookmark & Partial<{
   type: BookmarkType.PLAINTEXT;
}>;

export type ResourceBookmark = BaseBookmark & Partial<{
   type: BookmarkType.RESOURCE;
}>;

export type BookBookmark = BaseBookmark & Partial<{
   type: BookmarkType.BOOK;
   subtitle?: string;
   authors: string[];
   amazonUrl?: string;
   publishYear: number;
   isbn: string;
}>;

export type ComicsBookmark = BaseBookmark & Partial<{
   type: BookmarkType.COMICS;
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
