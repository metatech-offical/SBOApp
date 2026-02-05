import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {authApi} from '@rtkServices/AuthService';
import {api} from '@rtkServices/index';
import {resetCartCount} from '../Cart';
import {clearAddressState} from '../AddressManager';
import {setHasNotifications} from '../NotificationManager';
import {profileApi} from '@rtkServices/ProfileService';

const initialState: any = {
  user: null,
};

export const logoutUser = createAsyncThunk(
  'app/user/logout',
  async (_, {dispatch}) => {
    dispatch(api.util.resetApiState());
    dispatch(resetCartCount());
    dispatch(clearAddressState());
    dispatch(setHasNotifications(false));
    await AsyncStorage.removeItem('accessToken');
    await AsyncStorage.removeItem('refreshToken');
    return null;
  },
);

const userSlice = createSlice({
  name: 'app/user',
  initialState,
  reducers: {
    updateUser: (state, {payload}) => {
      state.user = payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(logoutUser.fulfilled, state => {
      state.user = null;
    });
    builder.addMatcher(
      authApi.endpoints.login.matchFulfilled,
      (state, {payload}) => {
        if (payload && payload.data && payload.data.user) {
          state.user = payload.data.user;
        }
      },
    );
    builder.addMatcher(
      authApi.endpoints.completeProfile.matchFulfilled,
      (state, {payload}) => {
        if (payload && payload.data && payload.data.user) {
          state.user = payload.data.user;
        }
      },
    );
    builder.addMatcher(
      profileApi.endpoints.updateMembershipPlan.matchFulfilled,
      (state, {payload}) => {
        if (payload && payload.data) {
          state.user = payload.data;
        }
      },
    );
  },
});

export const userReducer = userSlice.reducer;
export const {updateUser} = userSlice.actions;
