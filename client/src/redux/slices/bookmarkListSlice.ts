import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Bookmark } from '../../models/bookmark';
import { Pagination, paginationToDatabasePage } from '../../models/page';
import axios from 'axios';
import { WithId } from '../../utils/with-id';


export const getBookmarks = createAsyncThunk(
   'bookmark/getBookmarks',
   async (page: Pagination, thunkAPI) => {
      const dbPage = paginationToDatabasePage(page);
      const { data } = await axios.post('http://localhost:8080/api/getBookmarks', {
         ...dbPage
      });
      return data.bookmarks;
   }
);

export const deleteBookmark = createAsyncThunk(
   'bookmark/deleteBookmark',
   async (bookmarkId: string, thunkAPI) => {
      await axios.post('http://localhost:8080/api/deleteBookmark', {
         id: bookmarkId
      });
      thunkAPI.dispatch(getBookmarks({
         size: 20,
         index: 0
      }))
   }
);

interface BookmarksListState {
   bookmarks: WithId<Bookmark>[];
}

const initialState: BookmarksListState = {
   bookmarks: []
};

export const bookmarkListSlice = createSlice({
   name: 'bookmarkList',
   initialState,
   reducers: {},
   extraReducers: (builder) => builder
      .addCase(getBookmarks.fulfilled, (state: BookmarksListState, action: PayloadAction<WithId<Bookmark>[]>) => {
         state.bookmarks = action.payload;
      })
});

export const bookmarkListReducer = bookmarkListSlice.reducer;

