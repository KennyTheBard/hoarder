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

interface TagSliceState {
   tagMaps: Record<Id, WithId<Tag>>;
   tagsExtended: WithId<TagExtended>[];
   loading: boolean;
}

const initialState: TagSliceState = {
   tagMaps: {},
   tagsExtended: [],
   loading: false
};

export const TagSlice = createSlice({
   name: 'tags',
   initialState,
   reducers: {
      loading(state: TagSliceState) {
         state.loading = true;
      }
   },
   extraReducers: (builder) => builder
      .addCase(getAllTags.fulfilled, (state: TagSliceState, action: PayloadAction<WithId<Tag>[]>) => {
         const tags: Record<Id, WithId<Tag>> = {};
         for (const tag of action.payload) {
            tags[tag.id] = tag;
         }
         state.tagMaps = tags;
         state.loading = false;
      })
      .addCase(getTagsExtended.fulfilled, (state: TagSliceState, action: PayloadAction<WithId<TagExtended>[]>) => {
         state.tagsExtended = action.payload;
         state.loading = false;
      })
});

const { loading } = TagSlice.actions
export const tagSliceReducer = TagSlice.reducer;

