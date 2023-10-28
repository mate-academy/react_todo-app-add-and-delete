import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Todo } from '../types/Todo';
import { getTodos } from '../api/todos';

export interface TodoState {
  todos: Todo[];
  status: 'idle' | 'loading' | 'failed';
  error: string | null;
}

const initialState: TodoState = {
  todos: [],
  status: 'idle',
  error: null,
};

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

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<Todo>) => {
      state.todos.push(action.payload);
    },
    removeTodo: (state, action: PayloadAction<number>) => {
      state.todos = state.todos.filter(todo => todo.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchTodos.fulfilled, (
        state,
        action: PayloadAction<Todo[]>,
      ) => {
        state.status = 'idle';
        state.todos = action.payload;
      })
      .addCase(fetchTodos.rejected, (
        state,
        action: PayloadAction<string | undefined>,
      ) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Unknown error';
      });
  },
});

export const { addTodo, removeTodo } = todoSlice.actions;
export default todoSlice.reducer;
