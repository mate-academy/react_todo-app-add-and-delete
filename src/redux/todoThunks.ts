import { createAsyncThunk } from '@reduxjs/toolkit';
import { Todo } from '../types/Todo';
import {
  AddTodoResponse,
  addTodoApi,
  getTodos,
  removeTodoApi,
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

    return response.data;
  },
);

export const removeTodo = createAsyncThunk(
  'todos/removeTodo',
  async (todoId: number) => {
    await removeTodoApi(todoId);

    return todoId;
  },
);
