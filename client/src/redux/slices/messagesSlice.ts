import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Message, MessageSearchForm, WithId } from 'common';
import { DEFAULT_PAGE_SIZE } from '../../utils';
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
      messagesLoading(state: MessagesState) {
         state.loading = true;
      },
      setOnlyPending(state: MessagesState, action: PayloadAction<boolean>) {
         state.searchForm.onlyPending = action.payload;
      },
   },
   extraReducers: (builder) => builder
      .addCase(getMessages.fulfilled, (state: MessagesState, action: PayloadAction<WithId<Message>[]>) => {
         state.messages = action.payload;
         state.loading = false;
      })
});

export const { messagesLoading, setOnlyPending } = MessagesSlice.actions;
export const messagesReducer = MessagesSlice.reducer;

