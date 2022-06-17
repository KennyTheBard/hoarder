import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AnonymousBookmark, WithId, Bookmark, BookmarkType } from 'common';
import { bookmarkService, metadataService, validationService } from '../../services';


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
   async (bookmark: AnonymousBookmark, thunkAPI) => {
      const { data } = await bookmarkService.saveBookmark(bookmark);
      return data;
   }
);

export const updateBookmark = createAsyncThunk(
   'pinBookmark/updateBookmark',
   async (bookmark: WithId<Bookmark>, thunkAPI) => {
      const { data } = await bookmarkService.updateBookmark(bookmark);
      return data;
   }
);

export const getMetadataCandidates = createAsyncThunk(
   'pinBookmark/getMetadataCandidates',
   async (payload: {
      type: BookmarkType,
      title: string
   }, thunkAPI) => {
      const { data } = await metadataService.getMetadataCandidates(payload.type, payload.title);
      return data.candidates;
   }
);

export const getVideoDurationInSeconds = createAsyncThunk(
   'pinBookmark/getVideoDurationInSeconds',
   async (url: string, thunkAPI) => {
      const { data } = await metadataService.getVideoDurationInSeconds(url);
      return data.durationInSeconds;
   }
);

export const isUrlAlreadyBookmarked = createAsyncThunk(
   'pinBookmark/isUrlAlreadyBookmarked',
   async (url: string, thunkAPI) => {
      const { data } = await validationService.isUrlAlreadyBookmarked(url);
      return data.alreadyBookmarked;
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

