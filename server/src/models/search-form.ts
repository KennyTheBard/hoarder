import { BookmarkType } from './../../../server/src/models/bookmark';


export type BookmarkSearchForm = {
   searchTerm?: string;
   types?: BookmarkType[];
   tags?: string[];
}