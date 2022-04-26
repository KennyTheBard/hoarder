export type Bookmark = ArticleBookmark | PlainTextBookmark | VideoBookmark |
   MovieBookmark | ShowBookmark | AnimeBookmark | GameBookmark;

export type ArticleBookmark = BaseBookmark<'article'> & {
   url: string;
   title: string;
   hostname: string;
   previewUrl?: string;
}

export type PlainTextBookmark = BaseBookmark<'text'> & {
   content: string;
}

export type VideoBookmark = BaseBookmark<'video'> & {
   platform: string;
   lengthInSeconds: number;
}

export type MovieBookmark = BaseBookmark<'movie'> & {
   platform?: string;
   imdbUrl: string;
   imdbRating?: number;
   posterUrl?: string;
   publishingYear: number;
}

export type ShowBookmark = MovieBookmark & BaseBookmark<'show'> & {
   seasonsCount: number;
   ongoing: boolean;
}

export type AnimeBookmark = BaseBookmark<'anime'> & {
   platform?: string;
   myAnimeListUrl: string;
   myAnimeListRating?: number;
   posterUrl: string;
   publishingYear?: number;
   adaptedAfterManga: boolean;
   episodesCount: number;
}

export type GameBookmark = BaseBookmark<'game'> & {
   url: string;
   title: string;
   platforms: GamePlatform[];
   stores: GameStore[];
   reviewScore: number;
   reviewSource: string;
}

export type BaseBookmark<T extends string> = {
   type: T,
   tags: string[],
   createdTimestamp: number,
   updatedTimestamp: number
}

export enum GameStore {
   STEAM = 'steam',
   EPIC = 'epic',
   GOG = 'gog',
   ITCH = 'itch',
   MICROSOFT = 'microsoft'
}

export enum GamePlatform {
   WINDOWS = 'Windows',
   LINUX = 'Linux',
   MAC = 'MacOS',
   SWITCH = 'Nintendo Switch',
   ANDROID = 'Android',
   iOS = 'iOS',
   PS1 = 'Play Station 1',
   PS2 = 'Play Station 2',
   PS3 = 'Play Station 3',
   PS4 = 'Play Station 4',
   PS5 = 'Play Station 5',
   XBOX = 'Xbox',
   XBOX_360 = 'Xbox 360',
   XBOX_ONE = 'Xbox One',
   XBOX_X = 'Xbox Series X'
}