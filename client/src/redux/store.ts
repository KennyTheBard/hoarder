import { configureStore } from '@reduxjs/toolkit';
import { bookmarkSliceReducer, messageSliceReducer, pinBookmarkReducer, tagSliceReducer } from './slices';


export const store = configureStore({
   reducer: {
      pinBookmark: pinBookmarkReducer,
      bookmarkSlice: bookmarkSliceReducer,
      tagSlice: tagSliceReducer,
      messageSlice: messageSliceReducer,
   },
   middleware: (getDefaultMiddleware) => getDefaultMiddleware()
      .concat(({ dispatch, getState }) => next => action => {
         next(action);
         // console.log(getState());
      })
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;