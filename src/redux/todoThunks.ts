/* eslint-disable no-console */
import { createAsyncThunk } from '@reduxjs/toolkit';
import { Todo } from '../types/Todo';
import {
  AddTodoResponse,
  addTodoApi,
  getTodos,
  removeTodoApi,
  setTodoCompletionApi,
} from '../api/todos';

export const fetchTodos
  = createAsyncThunk<Todo[], number, { rejectValue: string }>(
    'todos/fetchTodos',
    async (userId, { rejectWithValue }) => {
      try {
        const todos = await getTodos(userId);

        return todos;
      } catch (error) {
        return rejectWithValue('Failed to fetch todos');
      }
    },
  );

export const addTodo = createAsyncThunk(
  'todos/addTodo',
  async ({ title }: { title: string }): Promise<Todo> => {
    const response: AddTodoResponse = await addTodoApi(title);

    console.log(response.data, 'in thunk');

    return response.data;
  },
);

export const deleteTodo = createAsyncThunk(
  'todos/deleteTodo',
  async (todoId: number) => {
    await removeTodoApi(todoId);

    return todoId;
  },
);

export const setCompletion = createAsyncThunk(
  'todos/setCompletion',
  async (
    { todoId, completed }: { todoId: number; completed: boolean },
    { rejectWithValue },
  ) => {
    try {
      const response = await setTodoCompletionApi(todoId, completed);

      return response;
    } catch (error) {
      return rejectWithValue('Failed to update todo completion status');
    }
  },
);
