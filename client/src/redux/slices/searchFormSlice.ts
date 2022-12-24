import { createAsyncThunk, createSlice, PayloadAction, Reducer } from '@reduxjs/toolkit';
import { getBookmarks } from './bookmarkListSlice';
import debounce from 'lodash.debounce';
import { BookmarkType, BookmarkSearchForm, FilterOperator, Id } from 'common';


const debouncedGetBookmarks = debounce((thunkAPI) => {
   thunkAPI.dispatch(getBookmarks());
}, 500);

export const setSearchTermAndUpdate = createAsyncThunk(
   'searchForm/setSearchTermAndUpdate',
   async (searchTerm: string, thunkAPI) => {
      thunkAPI.dispatch(setSearchTerm(searchTerm));
      debouncedGetBookmarks(thunkAPI);
   }
);

export const setTypesAndUpdate = createAsyncThunk(
   'searchForm/setTypesAndUpdate',
   async (types: BookmarkType[], thunkAPI) => {
      thunkAPI.dispatch(setTypes(types));
      debouncedGetBookmarks(thunkAPI);
   }
);

export const setTagsAndUpdate = createAsyncThunk(
   'searchForm/setTagsAndUpdate',
   async (tags: Id[], thunkAPI) => {
      thunkAPI.dispatch(setTags(tags));
      debouncedGetBookmarks(thunkAPI);
   }
);

export const setTagsOperatorAndUpdate = createAsyncThunk(
   'searchForm/setTagsOperatorAndUpdate',
   async (op: FilterOperator, thunkAPI) => {
      thunkAPI.dispatch(setTagsOperator(op));
      debouncedGetBookmarks(thunkAPI);
   }
);

const PAGE_SIZE = 30;

// TODO: move this in bookmark slice
const initialState: BookmarkSearchForm = {
   isArchived: false,
   pagination: {
      limit: PAGE_SIZE
   },
   tagsOperator: FilterOperator.OR,
};

export const searchFormSlice = createSlice({
   name: 'searchForm',
   initialState,
   reducers: {
      setSearchTerm(state: BookmarkSearchForm, action: PayloadAction<string>) {
         const searchTerm = action.payload;
         state.searchTerm = searchTerm.length > 0 ? searchTerm : undefined;
      },
      setTypes(state: BookmarkSearchForm, action: PayloadAction<BookmarkType[]>) {
         const types = action.payload;
         state.types = types.length > 0 ? types : undefined;
      },
      setTags(state: BookmarkSearchForm, action: PayloadAction<Id[]>) {
         const tags = action.payload;
         state.tags = tags.length > 0 ? tags : undefined;
      },
      setTagsOperator(state: BookmarkSearchForm, action: PayloadAction<FilterOperator>) {
         state.tagsOperator = action.payload;
      },
      setShowArchived(state: BookmarkSearchForm, action: PayloadAction<boolean>) {
         state.isArchived = action.payload;
      },
      getNextPage(state: BookmarkSearchForm, _action: PayloadAction<void>) {
         state.pagination = {
            ...state.pagination,
            skip: (state.pagination.skip || 0) + PAGE_SIZE
         };
      }
   }
});

const { setSearchTerm, setTypes, setTags, setTagsOperator, setShowArchived, getNextPage } = searchFormSlice.actions;
export { setShowArchived, getNextPage };
export const searchFormReducer: Reducer<typeof initialState> = searchFormSlice.reducer;