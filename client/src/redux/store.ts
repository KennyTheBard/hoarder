import { configureStore } from '@reduxjs/toolkit';
import { bookmarkListReducer, addBookmarkReducer, modalReducer } from './slices';


export const store = configureStore({
   reducer: {
      bookmarkList: bookmarkListReducer,
      modal: modalReducer,
      addBookmark: addBookmarkReducer
   },
   middleware: (getDefaultMiddleware) => getDefaultMiddleware()
      .concat(({ dispatch, getState }) => next => action => {
         next(action);
         console.log(getState());
      })
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;