import { createAsyncThunk } from '@reduxjs/toolkit';
import User from '../../models/User';
import storageService from '../../services/storageService';
import { httpClient } from '../../utilities/HttpClient';

const endpoint = '/users';

const UsersAsync = {
  fetchUser: createAsyncThunk('users/fetchUser', async (email: string) => {
    const users = await httpClient.get<User[]>(`${endpoint}?email=${email}`);
    const user = users[0] || null;

    if (user) {
      storageService.setUser(user);
    }

    return user;
  }),
  createUser: createAsyncThunk(
    'users/createUser',
    async (data: Omit<User, 'id'>) => {
      const user = await httpClient.post(endpoint, data) as User;

      storageService.setUser(user);

      return user;
    },
  ),
};

export default UsersAsync;
