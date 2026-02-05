import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface AddressState {
  selectedAddress: GetAllAddressData | null;
}

const initialState: AddressState = {
  selectedAddress: null,
};

const addressSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {
    setSelectedAddress: (
      state,
      action: PayloadAction<GetAllAddressData | null>,
    ) => {
      state.selectedAddress = action.payload;
    },

    clearAddressState: state => {
      state.selectedAddress = null;
    },
  },
});

export const {setSelectedAddress, clearAddressState} = addressSlice.actions;

export default addressSlice.reducer;
