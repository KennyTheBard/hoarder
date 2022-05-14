import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Tag } from '../../models';
import { tagService } from '../../services';
import { WithId } from '../../utils';


export const getTags = createAsyncThunk(
   'tags/getTags',
   async (thunkAPI) => {
      const { data } = await tagService.getTags();
      return data.tags;
   }
);

export const addTag = createAsyncThunk(
   'tags/addTag',
   async (tagName: string, thunkAPI) => {
      await tagService.saveTag(tagName);
      thunkAPI.dispatch(getTags());
   }
);


export const updateTagName = createAsyncThunk(
   'tags/updateTagName',
   async (tag: WithId<Pick<Tag, 'name'>>, thunkAPI) => {
      const { data } = await tagService.updateTag({
         id: tag._id,
         tag: {
            name: tag.name
         }
      })
      thunkAPI.dispatch(getTags());
      return data;
   }
);


export const deleteTag = createAsyncThunk(
   'tags/deleteTag',
   async (id: string, thunkAPI) => {
      await tagService.deleteTag(id);
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

