import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { Metadata } from '../../models';
import { isValidHttpUrl } from '../../utils';

export const getUrlMetadata = createAsyncThunk(
   'bookmark/getUrlMetadata',
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

interface MetadataState {
   metadata?: Metadata;
}

const initialState: MetadataState = {};

export const metadataSlice = createSlice({
   name: 'metadata',
   initialState,
   reducers: {},
   extraReducers: (builder) => builder
      .addCase(getUrlMetadata.fulfilled, (state: MetadataState, action: PayloadAction<Metadata | undefined>) => {
         state.metadata = action.payload;
      })
})

export const metadataReducer = metadataSlice.reducer;