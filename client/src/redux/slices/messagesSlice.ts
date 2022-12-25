import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Id, Message, WithId } from 'common';
import { messageService } from '../../services';


export const getMessages = createAsyncThunk(
   'messages/getMessages',
   async (_, thunkAPI) => {
      thunkAPI.dispatch(loading());
      const { data } = await messageService.getMessages();
      console.log(data);
      return data.entries;
   }
);


export const ignoreMessages = createAsyncThunk(
   'messages/ignoreMessages',
   async (messageIds: Id[], thunkAPI) => {
      await messageService.ignoreMessages(messageIds);
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

