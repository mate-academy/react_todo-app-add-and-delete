import { createAsyncThunk } from '@reduxjs/toolkit';
import storageService from '../../services/storageService';
import { usersActions } from '../users/usersSlice';
import { authActions } from './authSlice';

const AuthAsync = {
  checkAuthenticated: createAsyncThunk(
    'auth/checkAuthenticated',
    async (_, thunkApi) => {
      const user = storageService.getUser();

      if (user) {
        thunkApi.dispatch(usersActions.setCurrentUser(user));
        thunkApi.dispatch(authActions.setAuthenticated(true));
      } else {
        thunkApi.dispatch(authActions.setAuthenticated(false));
      }
    },
  ),
  signOut: createAsyncThunk('auth/signOut', async (_, thunkApi) => {
    storageService.removeUser();
    thunkApi.dispatch(usersActions.setCurrentUser(null));
    thunkApi.dispatch(authActions.setAuthenticated(false));
  }),
};

export default AuthAsync;
