import { configureStore } from '@reduxjs/toolkit';
import { bookmarkListReducer, pinBookmarkReducer, tagsReducer } from './slices';


export const store = configureStore({
   reducer: {
      bookmarkList: bookmarkListReducer,
      pinBookmark: pinBookmarkReducer,
      tags: tagsReducer,
   },
   middleware: (getDefaultMiddleware) => getDefaultMiddleware()
      .concat(({ dispatch, getState }) => next => action => {
         next(action);
         console.log(getState());
      })
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;