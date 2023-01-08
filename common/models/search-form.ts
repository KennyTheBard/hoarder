import { Id, WithPagination } from '../utils';
import { BookmarkType } from './bookmark';

export type BookmarkSearchForm = WithPagination<{
   isArchived: boolean;
   searchTerm?: string;
   types?: BookmarkType[];
   tags?: Id[];
   tagsOperator: FilterOperator;
}>

export enum FilterOperator {
   AND = "and",
   OR = "or",
}

export type MessageSearchForm = WithPagination<{
   showOnlyPending: boolean;
}>