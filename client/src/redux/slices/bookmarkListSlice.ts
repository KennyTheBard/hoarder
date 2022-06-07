import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Bookmark } from '../../models/bookmark';
import { WithId } from '../../utils/support-types';
import { bookmarkService } from '../../services';


export const getBookmarks = createAsyncThunk(
   'bookmark/getBookmarks',
   async (thunkAPI) => {
      const { data } = await bookmarkService.getBookmarks();
      return data.entries;
   }
);

export const getArchivedBookmarks = createAsyncThunk(
   'bookmark/getArchivedBookmarks',
   async (thunkAPI) => {
      const { data } = await bookmarkService.getArchivedBookmarks();
      return data.entries;
   }
);

export const deleteBookmark = createAsyncThunk(
   'bookmark/deleteBookmark',
   async (bookmarkId: string, thunkAPI) => {
      await bookmarkService.deleteBookmark(bookmarkId);
      thunkAPI.dispatch(getBookmarks())
   }
);

export const updateIsArchivedForBookmark = createAsyncThunk(
   'bookmark/updateIsArchivedForBookmark',
   async (payload: {
      bookmarkId: string,
      isArchived: boolean
   }, thunkAPI) => {
      await bookmarkService.updateIsArchivedForBookmark(payload.bookmarkId, payload.isArchived);
      thunkAPI.dispatch(getBookmarks())
   }
);

interface BookmarksListState {}

const initialState: BookmarksListState = {};

export const bookmarkListSlice = createSlice({
   name: 'bookmarkList',
   initialState,
   reducers: {}
});

export const bookmarkListReducer = bookmarkListSlice.reducer;

