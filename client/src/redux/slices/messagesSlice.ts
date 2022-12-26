import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Id, Message, MessageStatus, WithId } from 'common';
import { messageService } from '../../services';


export const getMessages = createAsyncThunk(
   'messages/getMessages',
   async (_, thunkAPI) => {
      thunkAPI.dispatch(loading());
      const { data } = await messageService.getMessages();
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

