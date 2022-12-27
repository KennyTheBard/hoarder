import { createAsyncThunk, createSlice, PayloadAction, Reducer } from '@reduxjs/toolkit';
import { WithId, Bookmark, WithPagination, WithTotal, BookmarkSearchForm, FilterOperator, BookmarkType, Id } from 'common';
import { bookmarkService } from '../../services';
import { RootState } from '../store';
import debounce from 'lodash.debounce';


const debouncedGetBookmarks = debounce((thunkAPI) => {
   thunkAPI.dispatch(getBookmarks());
}, 500);

export const setSearchTermAndUpdate = createAsyncThunk(
   'bookmark/setSearchTermAndUpdate',
   async (searchTerm: string, thunkAPI) => {
      thunkAPI.dispatch(setSearchTerm(searchTerm));
      debouncedGetBookmarks(thunkAPI);
   }
);

export const setTypesAndUpdate = createAsyncThunk(
   'bookmark/setTypesAndUpdate',
   async (types: BookmarkType[], thunkAPI) => {
      thunkAPI.dispatch(setTypes(types));
      debouncedGetBookmarks(thunkAPI);
   }
);

export const setTagsAndUpdate = createAsyncThunk(
   'bookmark/setTagsAndUpdate',
   async (tags: Id[], thunkAPI) => {
      thunkAPI.dispatch(setTags(tags));
      debouncedGetBookmarks(thunkAPI);
   }
);

export const setTagsOperatorAndUpdate = createAsyncThunk(
   'bookmark/setTagsOperatorAndUpdate',
   async (op: FilterOperator, thunkAPI) => {
      thunkAPI.dispatch(setTagsOperator(op));
      debouncedGetBookmarks(thunkAPI);
   }
);

export const getBookmarks = createAsyncThunk(
   'bookmark/getBookmarks',
   async (_, thunkAPI) => {
      const state = thunkAPI.getState() as RootState;
      if (state.bookmarkList.loading) {
         return thunkAPI.rejectWithValue("Already requested")
      }

      thunkAPI.dispatch(loading());
      const { data } = await bookmarkService.getBookmarks(state.bookmarkList.searchForm);
      return data;
   }
);

export const archiveBookmark = createAsyncThunk(
   'bookmark/archiveBookmark',
   async (bookmarkId: string, thunkAPI) => {
      await bookmarkService.updateIsArchivedForBookmark(bookmarkId, true);
      thunkAPI.dispatch(getBookmarks());
   }
);

export const restoreBookmark = createAsyncThunk(
   'bookmark/restoreBookmark',
   async (bookmarkId: string, thunkAPI) => {
      await bookmarkService.updateIsArchivedForBookmark(bookmarkId, false);
      thunkAPI.dispatch(getBookmarks());
   }
);

export const deleteBookmark = createAsyncThunk(
   'bookmark/deleteBookmark',
   async (bookmarkId: string, thunkAPI) => {
      await bookmarkService.deleteBookmark(bookmarkId);
      thunkAPI.dispatch(getBookmarks());
   }
);

const PAGE_SIZE = 30;

interface BookmarkListState {
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
         limit: PAGE_SIZE
      },
      tagsOperator: FilterOperator.OR,
   },
};

export const bookmarkListSlice = createSlice({
   name: 'bookmarkList',
   initialState,
   reducers: {
      loading(state: BookmarkListState) {
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
            skip: (state.searchForm.pagination.skip || 0) + PAGE_SIZE
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

const { loading, setSearchTerm, setTypes, setTags, setTagsOperator, setShowArchived, getNextPage } = bookmarkListSlice.actions;
export { setShowArchived, getNextPage };
export const bookmarkListReducer: Reducer<typeof initialState> = bookmarkListSlice.reducer;