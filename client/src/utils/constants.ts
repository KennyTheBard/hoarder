import { SelectItem } from '@mantine/core';
import { BookmarkType } from '../models';


export const BOOKMARK_TYPE_OPTIONS: SelectItem[] = [
   { value: BookmarkType.ARTICLE, label: 'Article' },
   { value: BookmarkType.TOOL, label: 'Tool' },
   { value: BookmarkType.VIDEO, label: 'Video' },
   { value: BookmarkType.MOVIE, label: 'Movie' },
   { value: BookmarkType.SHOW, label: 'Show' },
   { value: BookmarkType.ANIME, label: 'Anime' },
   { value: BookmarkType.GAME, label: 'Game' },
   { value: BookmarkType.PLAINTEXT, label: 'Plaintext' },
];

export const DEFAULT_TAG_VARIANT = 'light';
export const DEFAULT_TAG_COLOR = 'blue'; 