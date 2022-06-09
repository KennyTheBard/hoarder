import { createAsyncThunk, createSlice, PayloadAction, Reducer } from '@reduxjs/toolkit';
import { BookmarkType } from '../../models/bookmark';
import { BookmarkSearchForm } from '../../models';
import { getBookmarks } from './bookmarkListSlice';
import debounce from 'lodash.debounce';


const debouncedGetBookmarks = debounce((thunkAPI) => {
   thunkAPI.dispatch(getBookmarks());
}, 500);

export const setSearchTermAndUpdate = createAsyncThunk(
   'searchForm/setSearchTermAndUpdate',
   async (searchTerm: string, thunkAPI) => {
      thunkAPI.dispatch(setSearchTerm(searchTerm));
      debouncedGetBookmarks(thunkAPI);
   }
);

export const setTypesAndUpdate = createAsyncThunk(
   'searchForm/setTypesAndUpdate',
   async (types: BookmarkType[], thunkAPI) => {
      thunkAPI.dispatch(setTypes(types));
      debouncedGetBookmarks(thunkAPI);
   }
);

interface SearchFormState {
   searchForm: BookmarkSearchForm;
   showArchived: boolean;
}

const initialState: SearchFormState = {
   searchForm: {},
   showArchived: false
};

export const searchFormSlice = createSlice({
   name: 'searchForm',
   initialState,
   reducers: {
      setSearchTerm(state: SearchFormState, action: PayloadAction<string>) {
         const searchTerm = action.payload;
         state.searchForm.searchTerm = searchTerm.length > 0 ? searchTerm : undefined;
      },
      setTypes(state: SearchFormState, action: PayloadAction<BookmarkType[]>) {
         const types = action.payload;
         state.searchForm.types = types.length > 0 ? types : undefined;
      },
      setShowArchived(state: SearchFormState, action: PayloadAction<boolean>) {
         state.showArchived = action.payload;
      }
   }
});

const { setSearchTerm, setTypes, setShowArchived } = searchFormSlice.actions
export { setShowArchived };
export const searchFormReducer: Reducer<typeof initialState> = searchFormSlice.reducer;