import { Id, KeysOfUnion, WithPagination } from '../utils';
import { Bookmark, BookmarkType } from './bookmark';

export type BookmarkSearchForm = WithPagination<{
   isArchived: boolean;
   searchTerm?: string;
   types?: BookmarkType[];
   tags?: Id[];
   tagsOperator: FilterOperator;
   sortingField?: KeysOfUnion<Bookmark>;
   sortingOrder?: 'desc' | 'asc';
}>

export enum FilterOperator {
   AND = "and",
   OR = "or",
}

export type MessageSearchForm = WithPagination<{
   showOnlyPending: boolean;
}>