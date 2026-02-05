import {createSlice} from '@reduxjs/toolkit';

interface NotificationState {
  hasNotifications: boolean;
}

const initialState: NotificationState = {
  hasNotifications: false,
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setHasNotifications: (state, {payload}) => {
      state.hasNotifications = payload;
    },
  },
});

export const notificationReducer = notificationSlice.reducer;
export const {setHasNotifications} = notificationSlice.actions;
