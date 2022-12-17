import { createAsyncThunk, createSlice, PayloadAction, Reducer } from '@reduxjs/toolkit';
import { getBookmarks } from './bookmarkListSlice';
import debounce from 'lodash.debounce';
import { BookmarkType, BookmarkSearchForm } from 'common';


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

const PAGE_SIZE = 30;

const initialState: BookmarkSearchForm = {
   isArchived: false,
   pagination: {
      limit: PAGE_SIZE
   }
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

const { setSearchTerm, setTypes, setShowArchived, getNextPage } = searchFormSlice.actions;
export { setShowArchived, getNextPage };
export const searchFormReducer: Reducer<typeof initialState> = searchFormSlice.reducer;