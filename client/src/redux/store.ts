import { configureStore } from '@reduxjs/toolkit';
import bookmarkReducer from './slices/bookmarkSlice';

export const store = configureStore({
   reducer: {
      bookmarksList: bookmarkReducer,
   }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;