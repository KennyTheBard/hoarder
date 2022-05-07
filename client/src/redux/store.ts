import { configureStore } from '@reduxjs/toolkit';
import { bookmarkReducer, modalReducer } from './slices';


export const store = configureStore({
   reducer: {
      bookmarksList: bookmarkReducer,
      modals: modalReducer
   }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;