import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Bookmark } from '../../models/bookmark';
import axios from 'axios';
import { WithId } from '../../utils/with-id';
import { Metadata } from '../../models';
import { isValidHttpUrl } from '../../utils';


export const getUrlMetadata = createAsyncThunk(
   'addBookmark/getUrlMetadata',
   async (url: string, thunkAPI) => {
      if (!isValidHttpUrl(url)) {
         return undefined;
      }
      const { data } = await axios.post('http://localhost:8080/api/getUrlMetadata', {
         url
      });
      return data.metadata;
   }
);

interface AddBookmarksState {
   type: string | null;
   title: string | null;
   url: string | null;
   details: {
      [key: string]: any
   }
   tags: string[];
   metadata?: Metadata;
}

const initialState: AddBookmarksState = {
   type: null,
   title: null,
   url: null,
   details: {},
   tags: []
};

export const addBookmarkSlice = createSlice({
   name: 'addBookmark',
   initialState,
   reducers: {},
   extraReducers: (builder) => builder
   .addCase(getUrlMetadata.fulfilled, (state: AddBookmarksState, action: PayloadAction<Metadata | undefined>) => {
      state.metadata = action.payload;
   })
});

export const addBookmarkReducer = addBookmarkSlice.reducer;

