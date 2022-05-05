import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Bookmark } from '../../models/bookmark';
import { Pagination, paginationToDatabasePage } from '../../models/page';
import axios from 'axios';


export const getBookmarks = createAsyncThunk(
   'bookmark/getBookmarks',
   async (page: Pagination, thunkAPI) => {
      const dbPage = paginationToDatabasePage(page);
      // const { data } = await got.post('http://localhost:8080/api/getBookmarks', {
      //    json: {
      //       ...dbPage
      //    }
      // }).json();
      const { data } = await axios.post('http://localhost:8080/api/getBookmarks', {
         ...dbPage
      });
      return data.bookmarks;
   }
);

interface BookmarksState {
   bookmarks: Bookmark[];
}

const initialState: BookmarksState = {
   bookmarks: []
};

export const bookmarkSlice = createSlice({
   name: 'bookmark',
   initialState,
   reducers: {
      // add: (state: BookmarksState, action: PayloadAction<number>) => {
      //    state.value += action.payload
      // },
      // substract: (state: BookmarksState, action: PayloadAction<number>) => {
      //    state.value -= action.payload
      // }
   },
   extraReducers: (builder) => builder
      .addCase(getBookmarks.fulfilled, (state: BookmarksState, action: PayloadAction<Bookmark[]>) => {
         state.bookmarks = action.payload;
      })
});

// export const { add, substract } = bookmarkSlice.actions;
export default bookmarkSlice.reducer

