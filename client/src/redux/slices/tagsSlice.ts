import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { Tag } from '../../models';


export const getTags = createAsyncThunk(
   'tags/getTags',
   async (thunkAPI) => {
      const { data } = await axios.post('http://localhost:8080/api/getTags');
      return data.tags;
   }
);

export const addTag = createAsyncThunk(
   'tags/addTag',
   async (tagName: string, thunkAPI) => {
      await axios.post('http://localhost:8080/api/addTag', {
         name: tagName
      });
      thunkAPI.dispatch(getTags());
   }
);

interface TagsState {
   tags: Tag[];
}

const initialState: TagsState = {
   tags: []
};

export const TagsSlice = createSlice({
   name: 'tags',
   initialState,
   reducers: {},
   extraReducers: (builder) => builder
      .addCase(getTags.fulfilled, (state: TagsState, action: PayloadAction<Tag[]>) => {
         state.tags = action.payload;
      })
});

export const tagsReducer = TagsSlice.reducer;

