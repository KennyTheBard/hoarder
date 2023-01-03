import { createAsyncThunk } from '@reduxjs/toolkit';
import { Id, MessageStatus } from 'common';
import { messageService } from '../../services';
import { MessageSliceState, messagesLoading, setOnlyPending } from '../slices';
import debounce from 'lodash.debounce';


const debouncedGetBookmarks = debounce((thunkAPI) => {
   thunkAPI.dispatch(getMessages());
}, 500);

export const getMessages = createAsyncThunk(
   'messages/getMessages',
   async (_, thunkAPI) => {
      const { messageSlice } = thunkAPI.getState() as {
         messageSlice: MessageSliceState
      };
      if (!messageSlice) {
         console.error("Could not find messageSlice in global store")
      }
      thunkAPI.dispatch(messagesLoading());
      const { data } = await messageService.getMessages(messageSlice.searchForm);
      return data.entries;
   }
);

export const markMessages = createAsyncThunk(
   'messages/markMessages',
   async (payload: {
      ids: Id[],
      status: MessageStatus
   }, thunkAPI) => {
      await messageService.markMessages(payload.ids, payload.status);
      thunkAPI.dispatch(getMessages());
   }
);

export const setOnlyPendingAndUpdate = createAsyncThunk(
   'bookmark/setOnlyPendingAndUpdate',
   async (onlyPending: boolean, thunkAPI) => {
      thunkAPI.dispatch(setOnlyPending(onlyPending));
      debouncedGetBookmarks(thunkAPI);
   }
);