import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { Bookmark, Metadata } from '../../models';
import { isValidHttpUrl } from '../../utils';


export const getUrlMetadata = createAsyncThunk(
   'addBookmark/getUrlMetadata',
   async (url: string, thunkAPI) => {
      const { data } = await axios.post('http://localhost:8080/api/getUrlMetadata', {
         url
      });
      return data.metadata;
   }
);

export const addBookmark = createAsyncThunk(
   'addBookmark/addBookmark',
   async (bookmark: Omit<Bookmark, "createdTimestamp" | "updatedTimestamp">, thunkAPI) => {
      const { data } = await axios.post('http://localhost:8080/api/addBookmark', bookmark);
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

