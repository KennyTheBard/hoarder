import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Id, Message, MessageSearchForm, MessageStatus, WithId } from 'common';
import { messageService } from '../../services';
import { DEFAULT_PAGE_SIZE } from '../../utils';
import { RootState } from '../store';
import { getMessages } from '../thunks';


export interface MessagesState {
   messages: WithId<Message>[];
   loading: boolean;
   searchForm: MessageSearchForm;
}

const initialState: MessagesState = {
   messages: [],
   loading: false,
   searchForm: {
      onlyPending: false,
      pagination: {
         limit: DEFAULT_PAGE_SIZE
      }
   }
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

