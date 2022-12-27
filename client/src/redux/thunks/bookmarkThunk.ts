import { BookmarkType, FilterOperator, Id } from 'common';
import { BookmarkListState, loading, setSearchTerm, setTags, setTagsOperator, setTypes } from '../slices';
import { createAsyncThunk } from '@reduxjs/toolkit';
import debounce from 'lodash.debounce';
import { bookmarkService } from '../../services';
import { RootState } from '../store';

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
      const { bookmarkList } = thunkAPI.getState() as {
         bookmarkList: BookmarkListState
      };
      if (bookmarkList.loading) {
         return thunkAPI.rejectWithValue("Already requested")
      }

      thunkAPI.dispatch(loading());
      const { data } = await bookmarkService.getBookmarks(bookmarkList.searchForm);
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