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
   reducers: {
      setType: (state: AddBookmarksState, action: PayloadAction<string>) => {
         state.type = action.payload
      },
      setTitle: (state: AddBookmarksState, action: PayloadAction<string>) => {
         state.title = action.payload
      },
      setUrl: (state: AddBookmarksState, action: PayloadAction<string>) => {
         state.url = action.payload
      },
      setDetails: (state: AddBookmarksState, action: PayloadAction<{
         name: string,
         value: any
      }>) => {
         state.details[action.payload.name] = action.payload.value
      },
      resetBookmarkForm: (state: AddBookmarksState, action: PayloadAction<void>) => {
         state.type = null;
         state.title = null;
         state.url = null;
         state.details = {};
         state.tags = [];
      },
   }
});

export const {
   setType,
   setTitle,
   setUrl,
   setDetails,
   resetBookmarkForm
} = addBookmarkSlice.actions;
export const addBookmarkReducer = addBookmarkSlice.reducer;

