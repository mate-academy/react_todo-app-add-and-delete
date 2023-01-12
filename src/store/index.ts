import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import usersReducer from './users/usersSlice';
import todosReducer from './todos/todosSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    todos: todosReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
