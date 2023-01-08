import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Message, MessageSearchForm, WithId } from 'common';
import { DEFAULT_PAGE_SIZE } from '../../utils';
import { getMessages } from '../thunks';


export interface MessageSliceState {
   messages: WithId<Message>[];
   loading: boolean;
   searchForm: MessageSearchForm;
}

const initialState: MessageSliceState = {
   messages: [],
   loading: false,
   searchForm: {
      showOnlyPending: true,
      pagination: {
         limit: DEFAULT_PAGE_SIZE
      }
   }
};

export const MessageSlice = createSlice({
   name: 'messages',
   initialState,
   reducers: {
      messagesLoading(state: MessageSliceState) {
         state.loading = true;
      },
      setOnlyPending(state: MessageSliceState, action: PayloadAction<boolean>) {
         state.searchForm.showOnlyPending = action.payload;
      },
   },
   extraReducers: (builder) => builder
      .addCase(getMessages.fulfilled, (state: MessageSliceState, action: PayloadAction<WithId<Message>[]>) => {
         state.messages = action.payload;
         state.loading = false;
      })
});

export const { messagesLoading, setOnlyPending } = MessageSlice.actions;
export const messageSliceReducer = MessageSlice.reducer;

