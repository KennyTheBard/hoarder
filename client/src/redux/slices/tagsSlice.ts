import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Tag } from '../../models';
import { tagService } from '../../services';
import { Id, WithId } from '../../utils';
import { getBookmarks } from './bookmarkListSlice';


export const getTags = createAsyncThunk(
   'tags/getTags',
   async (_, thunkAPI) => {
      thunkAPI.dispatch(loading());
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


export const updateTag = createAsyncThunk(
   'tags/updateTag',
   async (payload: {
      id: string,
      tag: Tag
   }, thunkAPI) => {
      const { data } = await tagService.updateTag(payload)
      thunkAPI.dispatch(getTags());
      return data;
   }
);


export const deleteTag = createAsyncThunk(
   'tags/deleteTag',
   async (id: string, thunkAPI) => {
      await tagService.deleteTag(id);
      thunkAPI.dispatch(getTags());
      thunkAPI.dispatch(getBookmarks());
   }
);

interface TagsState {
   tags: Record<Id, WithId<Tag>>;
   loading: boolean;
}

const initialState: TagsState = {
   tags: {},
   loading: false
};

export const TagsSlice = createSlice({
   name: 'tags',
   initialState,
   reducers: {
      loading(state: TagsState) {
         state.loading = true;
      }
   },
   extraReducers: (builder) => builder
      .addCase(getTags.fulfilled, (state: TagsState, action: PayloadAction<WithId<Tag>[]>) => {
         const tags: Record<Id, WithId<Tag>> = {};
         for (const tag of action.payload) {
            tags[tag._id] = tag;
         }
         state.tags = tags;
         state.loading = false;
      })
});

const { loading } = TagsSlice.actions
export const tagsReducer = TagsSlice.reducer;

