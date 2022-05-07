import { metadataReducer } from './slices/metadataSlice';
import { configureStore } from '@reduxjs/toolkit';
import { bookmarkReducer, modalReducer } from './slices';


export const store = configureStore({
   reducer: {
      bookmarks: bookmarkReducer,
      modal: modalReducer,
      metadata: metadataReducer
   }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;