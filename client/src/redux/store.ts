import { configureStore } from '@reduxjs/toolkit';
import {  bookmarkListReducer, addBookmarkReducer, modalReducer } from './slices';


export const store = configureStore({
   reducer: {
      bookmarkList: bookmarkListReducer,
      modal: modalReducer,
      addBookmark: addBookmarkReducer
   }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;