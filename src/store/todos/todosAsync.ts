import { createAsyncThunk } from '@reduxjs/toolkit';
import Todo, { TodoUpdateData } from '../../models/Todo';
import { httpClient } from '../../utilities/HttpClient';

const endpoint = '/todos';

const TodosAsync = {
  fetchTodos: createAsyncThunk('todos/fetchTodos', async (userId: number) => {
    const todos = await httpClient.get<Todo[]>(`${endpoint}?userId=${userId}`);

    return todos;
  }),
  createTodo: createAsyncThunk(
    'todos/createTodo',
    async (data: Omit<Todo, 'id'>) => {
      const todo = await httpClient.post(`${endpoint}`, data);

      return todo as Todo;
    },
  ),
  updateTodo: createAsyncThunk(
    'todos/updateTodo',
    async (data: TodoUpdateData) => {
      const { id, ...nextData } = data;
      const todo = await httpClient.patch(`${endpoint}/${id}`, nextData);

      return todo as Todo;
    },
  ),
  deleteTodo: createAsyncThunk('todos/deleteTodo', async (todoId: number) => {
    await httpClient.delete(`${endpoint}/${todoId}`);
  }),
};

export default TodosAsync;
