import { createSlice, PayloadAction, Reducer } from '@reduxjs/toolkit';
import { WithId, Bookmark, WithPagination, WithTotal, BookmarkSearchForm, FilterOperator, BookmarkType, Id } from 'common';
import { DEFAULT_PAGE_SIZE } from '../../utils';
import { getBookmarks } from '../thunks';


export interface BookmarkListState {
   bookmarks: WithId<Bookmark>[];
   bookmarksTotal?: number;
   loading: boolean;
   searchForm: BookmarkSearchForm;
}

const initialState: BookmarkListState = {
   bookmarks: [],
   loading: false,
   searchForm: {
      isArchived: false,
      pagination: {
         limit: DEFAULT_PAGE_SIZE
      },
      tagsOperator: FilterOperator.OR,
   },
};

export const bookmarkListSlice = createSlice({
   name: 'bookmarkList',
   initialState,
   reducers: {
      bookmarksLoading(state: BookmarkListState) {
         state.loading = true;
      },
      setSearchTerm(state: BookmarkListState, action: PayloadAction<string>) {
         const searchTerm = action.payload;
         state.searchForm.searchTerm = searchTerm.length > 0 ? searchTerm : undefined;
      },
      setTypes(state: BookmarkListState, action: PayloadAction<BookmarkType[]>) {
         const types = action.payload;
         state.searchForm.types = types.length > 0 ? types : undefined;
      },
      setTags(state: BookmarkListState, action: PayloadAction<Id[]>) {
         const tags = action.payload;
         state.searchForm.tags = tags.length > 0 ? tags : undefined;
      },
      setTagsOperator(state: BookmarkListState, action: PayloadAction<FilterOperator>) {
         state.searchForm.tagsOperator = action.payload;
      },
      setShowArchived(state: BookmarkListState, action: PayloadAction<boolean>) {
         state.searchForm.isArchived = action.payload;
      },
      getNextPage(state: BookmarkListState, _action: PayloadAction<void>) {
         state.searchForm.pagination = {
            ...state.searchForm.pagination,
            skip: (state.searchForm.pagination.skip || 0) + DEFAULT_PAGE_SIZE
         };
      },
   },
   extraReducers: (builder) => builder
      .addCase(getBookmarks.fulfilled, (state: BookmarkListState, action: PayloadAction<WithPagination<WithTotal<WithId<Bookmark>>>>) => {
         // state.bookmarks.push(...action.payload.entries);
         state.bookmarks = action.payload.entries;
         state.bookmarksTotal = action.payload.total;
         state.loading = false;
      })
});

export const { bookmarksLoading, setSearchTerm, setTypes, setTags, setTagsOperator, setShowArchived, getNextPage } = bookmarkListSlice.actions;
// export { setShowArchived, getNextPage };
export const bookmarkListReducer: Reducer<typeof initialState> = bookmarkListSlice.reducer;