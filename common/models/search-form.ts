import { BookmarkType } from './bookmark';

export type BookmarkSearchForm = {
   searchTerm?: string;
   types?: BookmarkType[];
   tags?: string[];
}