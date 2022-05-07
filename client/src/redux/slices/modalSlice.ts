import { createSlice, PayloadAction } from '@reduxjs/toolkit';


interface ModalState {
   isOpened: boolean;
}

const initialState: ModalState = {
   isOpened: false,
}

export const modalSlice = createSlice({
   name: 'modal',
   initialState,
   reducers: {
      setOpened: (state: ModalState, action: PayloadAction<boolean>) => {
         state.isOpened = action.payload;
      }
   }
});

export const { setOpened } = modalSlice.actions;
export const modalReducer = modalSlice.reducer;
