import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { Tag } from '../../models';
import { WithId } from '../../utils';


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


export const updateTagName = createAsyncThunk(
   'tags/updateTagName',
   async (tag: WithId<Pick<Tag, 'name'>>, thunkAPI) => {
      const { data } = await axios.post('http://localhost:8080/api/updateTag', {
         id: tag._id,
         tag: {
            name: tag.name
         }
      });
      thunkAPI.dispatch(getTags());
      return data;
   }
);


export const deleteTag = createAsyncThunk(
   'tags/deleteTag',
   async (id: string, thunkAPI) => {
      await axios.post('http://localhost:8080/api/deleteTag', {
         id
      });
      thunkAPI.dispatch(getTags());
   }
);

interface TagsState {
   tags: WithId<Tag>[];
}

const initialState: TagsState = {
   tags: []
};

export const TagsSlice = createSlice({
   name: 'tags',
   initialState,
   reducers: {},
   extraReducers: (builder) => builder
      .addCase(getTags.fulfilled, (state: TagsState, action: PayloadAction<WithId<Tag>[]>) => {
         state.tags = action.payload;
      })
});

export const tagsReducer = TagsSlice.reducer;

