import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Bookmark } from '../../models';
import { bookmarkService, metadataService } from '../../services';


export const getUrlMetadata = createAsyncThunk(
   'pinBookmark/getUrlMetadata',
   async (url: string, thunkAPI) => {
      const { data } = await metadataService.getUrlMetadata(url);
      return data.metadata;
   }
);

export const getTypeSuggestions = createAsyncThunk(
   'pinBookmark/getTypeSuggestions',
   async (url: string, thunkAPI) => {
      const { data } = await metadataService.getTypeSuggestions(url);
      return data.suggestions;
   }
);

export const saveBookmark = createAsyncThunk(
   'pinBookmark/saveBookmark',
   async (bookmark: Omit<Bookmark, "createdTimestamp" | "updatedTimestamp" | "hostname">, thunkAPI) => {
      const { data } = await bookmarkService.saveBookmark(bookmark);
      return data;
   }
);

export const getMetadataCandidates = createAsyncThunk(
   'pinBookmark/getMetadataCandidates',
   async (payload: {
      type: string,
      title: string
   }, thunkAPI) => {
      const { data } = await metadataService.getMetadataCandidates(payload.type, payload.title);
      return data.candidates;
   }
);

interface PinBookmarksState {}

const initialState: PinBookmarksState = {};

export const pinBookmarkSlice = createSlice({
   name: 'pinBookmark',
   initialState,
   reducers: {},
});

export const pinBookmarkReducer = pinBookmarkSlice.reducer;

