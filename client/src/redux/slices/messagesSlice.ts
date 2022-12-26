import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Id, Message, WithId } from 'common';
import { messageService } from '../../services';


export const getMessages = createAsyncThunk(
   'messages/getMessages',
   async (_, thunkAPI) => {
      thunkAPI.dispatch(loading());
      const { data } = await messageService.getMessages();
      return data.entries;
   }
);


export const markMessagesAsIgnored = createAsyncThunk(
   'messages/ignoreMessages',
   async (messageIds: Id[], thunkAPI) => {
      await messageService.markMessagesAsIgnored(messageIds);
      thunkAPI.dispatch(getMessages());
   }
);

export const markMessagesAsBookmarked = createAsyncThunk(
   'messages/markMessagesAsBookmarked',
   async (messageIds: Id[], thunkAPI) => {
      await messageService.markMessagesAsBookmarked(messageIds);
      thunkAPI.dispatch(getMessages());
   }
);


interface MessagesState {
   messages: WithId<Message>[];
   loading: boolean;
}

const initialState: MessagesState = {
   messages: [],
   loading: false
};

export const MessagesSlice = createSlice({
   name: 'messages',
   initialState,
   reducers: {
      loading(state: MessagesState) {
         state.loading = true;
      }
   },
   extraReducers: (builder) => builder
      .addCase(getMessages.fulfilled, (state: MessagesState, action: PayloadAction<WithId<Message>[]>) => {
         state.messages = action.payload;
         state.loading = false;
      })
});

const { loading } = MessagesSlice.actions;
export const messagesReducer = MessagesSlice.reducer;

