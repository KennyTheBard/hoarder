import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Bookmark } from '../../models/bookmark';
import { WithId } from '../../utils/with-id';
import { bookmarkService } from '../../services';


export const getBookmarks = createAsyncThunk(
   'bookmark/getBookmarks',
   async (thunkAPI) => {
      const { data } = await bookmarkService.getBookmarks();
      return data.bookmarks;
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

