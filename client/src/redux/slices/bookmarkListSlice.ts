import { createAsyncThunk, createSlice, PayloadAction, Reducer } from '@reduxjs/toolkit';
import { Bookmark } from '../../models/bookmark';
import { WithId } from '../../utils/support-types';
import { bookmarkService } from '../../services';
import { RootState } from '../store';



export const getBookmarks = createAsyncThunk(
   'bookmark/getBookmarks',
   async (_, thunkAPI) => {
      thunkAPI.dispatch(loading());
      const state = thunkAPI.getState() as RootState;
      const searchForm = state.searchForm.searchForm;
      const showArchived = state.searchForm.showArchived;
      const { data } = await bookmarkService.getBookmarks(showArchived, searchForm);
      return data.entries;
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
      thunkAPI.dispatch(getBookmarks())
   }
);

interface BookmarkListState {
   bookmarks: WithId<Bookmark>[];
   loading: boolean;
}

const initialState: BookmarkListState = {
   bookmarks: [],
   loading: false,
};

export const bookmarkListSlice = createSlice({
   name: 'bookmarkList',
   initialState,
   reducers: {
      loading(state: BookmarkListState) {
         state.loading = true;
      }
   },
   extraReducers: (builder) => builder
      .addCase(getBookmarks.fulfilled, (state: BookmarkListState, action: PayloadAction<WithId<Bookmark>[]>) => {
         state.bookmarks = action.payload;
         state.loading = false;
      })
});

const { loading } = bookmarkListSlice.actions
export const bookmarkListReducer: Reducer<typeof initialState> = bookmarkListSlice.reducer;