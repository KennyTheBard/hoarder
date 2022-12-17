import { createAsyncThunk, createSlice, PayloadAction, Reducer } from '@reduxjs/toolkit';
import { WithId, Bookmark, WithPagination } from 'common';
import { bookmarkService } from '../../services';
import { RootState } from '../store';



export const getBookmarks = createAsyncThunk(
   'bookmark/getBookmarks',
   async (_, thunkAPI) => {
      const state = thunkAPI.getState() as RootState;
      if (state.bookmarkList.loading) {
         return thunkAPI.rejectWithValue("Already requested")
      }

      thunkAPI.dispatch(loading());
      const { data } = await bookmarkService.getBookmarks(state.searchForm);
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
      .addCase(getBookmarks.fulfilled, (state: BookmarkListState, action: PayloadAction<WithPagination<{
         entries: WithId<Bookmark>[]
      }>>) => {
         const skip = action.payload.pagination.skip || 0;
         const entries = action.payload.entries;

         if (skip < state.bookmarks.length) {
            // delete till then
         } else {
            state.bookmarks.push(...entries);
         }

         // for (let index = skip; index < entries.length + skip; index++) {
         //    const entry = entries[index - skip];
         //    if (state.bookmarks.length <= index) {
         //       state.bookmarks.push(entry);
         //    } else {
         //       state.bookmarks[index] = entry;
         //    }
         // }
         
         // state.bookmarks = bookmarks;
         state.loading = false;
      })
});

const { loading } = bookmarkListSlice.actions
export const bookmarkListReducer: Reducer<typeof initialState> = bookmarkListSlice.reducer;