import { SelectItem } from '@mantine/core';
import { BookmarkType } from 'common';


export const BOOKMARK_TYPE_OPTIONS: SelectItem[] = [
   { value: BookmarkType.ARTICLE, label: 'Article' },
   { value: BookmarkType.TOOL, label: 'Tool' },
   { value: BookmarkType.COMICS, label: 'Comics' },
   { value: BookmarkType.VIDEO, label: 'Video' },
   { value: BookmarkType.MOVIE, label: 'Movie' },
   { value: BookmarkType.SHOW, label: 'Show' },
   { value: BookmarkType.ANIME, label: 'Anime' },
   { value: BookmarkType.GAME, label: 'Game' },
   { value: BookmarkType.BOARDGAME, label: 'Board Game' },
   { value: BookmarkType.PLAINTEXT, label: 'Plaintext' },
   { value: BookmarkType.RESOURCE, label: 'Resource' },
   { value: BookmarkType.BOOK, label: 'Book' },
];

export const DEFAULT_TAG_VARIANT = 'light';
export const DEFAULT_TAG_COLOR = 'blue'; 
export const DEFAULT_PAGE_SIZE = 30;