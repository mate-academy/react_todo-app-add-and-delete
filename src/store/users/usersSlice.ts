/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import User from '../../models/User';
import UsersAsync from './usersAsync';

export interface State {
  currentUser: User | null;
}

const initialState: State = {
  currentUser: null,
};

export const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setCurrentUser: (state:State, action:PayloadAction<User | null>) => {
      state.currentUser = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(
        UsersAsync.fetchUser.fulfilled,
        (state: State, action: PayloadAction<User>) => {
          state.currentUser = action.payload;
        },
      )
      .addCase(
        UsersAsync.createUser.fulfilled,
        (state: State, action: PayloadAction<User>) => {
          state.currentUser = action.payload;
        },
      );
  },
});

export const usersActions = usersSlice.actions;

export default usersSlice.reducer;
