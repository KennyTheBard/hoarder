import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Bookmark, Metadata } from '../../models';
import { bookmarkService, metadataService } from '../../services';


export const getUrlMetadata = createAsyncThunk(
   'addBookmark/getUrlMetadata',
   async (url: string, thunkAPI) => {
      const { data } = await metadataService.getUrlMetadata(url);
      return data.metadata;
   }
);

export const addBookmark = createAsyncThunk(
   'addBookmark/addBookmark',
   async (bookmark: Omit<Bookmark, "createdTimestamp" | "updatedTimestamp">, thunkAPI) => {
      const { data } = await bookmarkService.saveBookmark(bookmark);
      return data;
   }
);

interface AddBookmarksState {
   metadata: Metadata | null;
}

const initialState: AddBookmarksState = {
   metadata: null
};

export const addBookmarkSlice = createSlice({
   name: 'addBookmark',
   initialState,
   reducers: {
      resetMetadata: (state: AddBookmarksState, action: PayloadAction<void>) => {
         state.metadata = null;
      },
   },
   extraReducers: (builder) => builder
      .addCase(getUrlMetadata.fulfilled, (state: AddBookmarksState, action: PayloadAction<Metadata>) => {
         state.metadata = action.payload;
      })
});

export const { resetMetadata } = addBookmarkSlice.actions;
export const addBookmarkReducer = addBookmarkSlice.reducer;

