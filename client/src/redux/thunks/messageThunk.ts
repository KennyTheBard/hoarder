import { createAsyncThunk } from '@reduxjs/toolkit';
import { Id, MessageStatus } from 'common';
import { messageService } from '../../services';
import { MessagesState, loading } from '../slices';


export const getMessages = createAsyncThunk(
   'messages/getMessages',
   async (_, thunkAPI) => {
      const { messages } = thunkAPI.getState() as {
         messages: MessagesState
      };
      thunkAPI.dispatch(loading());
      const { data } = await messageService.getMessages(messages.searchForm);
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