import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Bookmark, BookmarkTypeSuggestion, GameDurationCandidate, Metadata } from '../../models';
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

export const getGameDurationCandidates = createAsyncThunk(
   'pinBookmark/getGameDurationCandidates',
   async (gameTitle: string, thunkAPI) => {
      const { data } = await metadataService.getGameDurationCandidates(gameTitle);
      return data.candidates;
   }
);

export const getGameMetadataCandidates = createAsyncThunk(
   'pinBookmark/getGameMetadataCandidates',
   async (payload: {
      type: string,
      gameTitle: string
   }, thunkAPI) => {
      switch (payload.type) {
         case 'game':
            return (await metadataService.getGameMetadataCandidates(payload.gameTitle)).data.candidates
         default:
            return null;
      }
   }
);

interface PinBookmarksState {
   // metadata: Metadata | null;
   // gameDurationCandidates: GameDurationCandidate[] | null;
   // typeSuggestions: BookmarkTypeSuggestion[];
}

const initialState: PinBookmarksState = {
   // metadata: null,
   // typeSuggestions: [],
};

export const pinBookmarkSlice = createSlice({
   name: 'pinBookmark',
   initialState,
   reducers: {},
   // extraReducers: (builder) => builder
   //    .addCase(getUrlMetadata.fulfilled, (state: PinBookmarksState, action: PayloadAction<Metadata>) => {
   //       state.metadata = action.payload;
   //    })
   //    .addCase(getGameDurationCandidates.fulfilled, (state: PinBookmarksState, action: PayloadAction<GameDurationCandidate[]>) => {
   //       state.gameDurationCandidates = action.payload;
   //    })
   //    .addCase(getTypeSuggestions.fulfilled, (state: PinBookmarksState, action: PayloadAction<BookmarkTypeSuggestion[]>) => {
   //       state.typeSuggestions = action.payload;
   //    })
});

export const pinBookmarkReducer = pinBookmarkSlice.reducer;

