import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Id, Tag, TagExtended, WithId } from 'common';
import { tagService } from '../../services';
import { getBookmarks } from '../thunks';


export const getAllTags = createAsyncThunk(
   'tags/getAllTags',
   async (_, thunkAPI) => {
      thunkAPI.dispatch(loading());
      const { data } = await tagService.getAllTags();
      return data.tags;
   }
);

export const getTagsExtended = createAsyncThunk(
   'tags/getTagsExtended',
   async (_, thunkAPI) => {
      thunkAPI.dispatch(loading());
      const { data } = await tagService.getTagsExtended();
      return data.entries;
   }
);

export const addTag = createAsyncThunk(
   'tags/addTag',
   async (tagName: string, thunkAPI) => {
      const { data } = await tagService.addTag(tagName);
      thunkAPI.dispatch(getAllTags());
      return data;
   }
);


export const updateTag = createAsyncThunk(
   'tags/updateTag',
   async (payload: {
      id: string,
      tag: Tag
   }, thunkAPI) => {
      const { data } = await tagService.updateTag(payload)
      thunkAPI.dispatch(getAllTags());
      return data;
   }
);


export const deleteTags = createAsyncThunk(
   'tags/deleteTags',
   async (ids: Id[], thunkAPI) => {
      await tagService.deleteTags(ids);
      thunkAPI.dispatch(getAllTags());
      thunkAPI.dispatch(getBookmarks());
   }
);

interface TagsState {
   tags: Record<Id, WithId<Tag>>;
   tagsExtended: WithId<TagExtended>[];
   loading: boolean;
}

const initialState: TagsState = {
   tags: {},
   tagsExtended: [],
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
      .addCase(getAllTags.fulfilled, (state: TagsState, action: PayloadAction<WithId<Tag>[]>) => {
         const tags: Record<Id, WithId<Tag>> = {};
         for (const tag of action.payload) {
            tags[tag.id] = tag;
         }
         state.tags = tags;
         state.loading = false;
      })
      .addCase(getTagsExtended.fulfilled, (state: TagsState, action: PayloadAction<WithId<TagExtended>[]>) => {
         console.log('payload', action.payload)
         state.tagsExtended = action.payload;
         state.loading = false;
      })
});

const { loading } = TagsSlice.actions
export const tagsReducer = TagsSlice.reducer;

