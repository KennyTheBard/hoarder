import { WithPagination } from '../utils';
import { BookmarkType } from './bookmark';

export type BookmarkSearchForm = WithPagination<{
   isArchived: boolean;
   searchTerm?: string;
   types?: BookmarkType[];
   tags?: string[];
}>