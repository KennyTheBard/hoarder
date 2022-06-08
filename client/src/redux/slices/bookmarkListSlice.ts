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

export const archiveBookmark = createAsyncThunk(
   'bookmark/archiveBookmark',
   async (bookmarkId: string, thunkAPI) => {
      await bookmarkService.updateIsArchivedForBookmark(bookmarkId, true);
      thunkAPI.dispatch(getBookmarks())
   }
);

export const restoreBookmark = createAsyncThunk(
   'bookmark/restoreBookmark',
   async (bookmarkId: string, thunkAPI) => {
      await bookmarkService.updateIsArchivedForBookmark(bookmarkId, false);
      thunkAPI.dispatch(getArchivedBookmarks())
   }
);

export const deleteBookmark = createAsyncThunk(
   'bookmark/deleteBookmark',
   async (bookmarkId: string, thunkAPI) => {
      await bookmarkService.deleteBookmark(bookmarkId);
      thunkAPI.dispatch(getArchivedBookmarks())
   }
);

interface BookmarksState {
   bookmarks: WithId<Bookmark>[];
}

const initialState: BookmarksState = {
   bookmarks: []
};

export const bookmarkListSlice = createSlice({
   name: 'bookmarkList',
   initialState,
   reducers: {},
   extraReducers: (builder) => builder
      .addCase(getBookmarks.fulfilled, (state: BookmarksState, action: PayloadAction<WithId<Bookmark>[]>) => {
         state.bookmarks = action.payload;
      })
      .addCase(getArchivedBookmarks.fulfilled, (state: BookmarksState, action: PayloadAction<WithId<Bookmark>[]>) => {
         state.bookmarks = action.payload;
      })
});

export const bookmarkListReducer = bookmarkListSlice.reducer;

