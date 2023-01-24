import { SelectItem } from '@mantine/core';
import { BookmarkType } from 'common';


export const BOOKMARK_TYPE_OPTIONS: SelectItem[] = [
   { value: BookmarkType.ANIME, label: 'Anime' },
   { value: BookmarkType.ARTICLE, label: 'Article' },
   { value: BookmarkType.BOARDGAME, label: 'Board Game' },
   { value: BookmarkType.BOOK, label: 'Book' },
   { value: BookmarkType.COMICS, label: 'Comics' },
   { value: BookmarkType.GAME, label: 'Game' },
   { value: BookmarkType.MOVIE, label: 'Movie' },
   { value: BookmarkType.PLAINTEXT, label: 'Plaintext' },
   { value: BookmarkType.RESOURCE, label: 'Resource' },
   { value: BookmarkType.SHOW, label: 'Show' },
   { value: BookmarkType.TOOL, label: 'Tool' },
   { value: BookmarkType.VIDEO, label: 'Video' },
];

export const DEFAULT_TAG_VARIANT = 'light';
export const DEFAULT_TAG_COLOR = 'blue'; 
export const DEFAULT_PAGE_SIZE = 30;