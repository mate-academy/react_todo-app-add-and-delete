/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Todo } from '../types/Todo';
import { TodoFilter } from '../types/TodoFilter';
import { ErrorType } from '../types/errorType';
import { fetchTodos, addTodo, deleteTodo } from './todoThunks';

export interface TodoState {
  todos: Todo[];
  tempTodo: Todo | null;
  inputValue: string,
  status: 'idle' | 'loading' | 'failed';
  error: string | null;
  filter: TodoFilter;
  errorType: ErrorType | null;
}

const initialState: TodoState = {
  todos: [],
  tempTodo: null,
  inputValue: '',
  status: 'idle',
  error: null,
  filter: TodoFilter.All,
  errorType: null,
};

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<TodoFilter>) => {
      state.filter = action.payload;
    },
    setTempTodo(state, action) {
      state.tempTodo = action.payload;
    },
    clearTempTodo(state) {
      state.tempTodo = null;
    },
    setInputValue: (state, action) => {
      state.inputValue = action.payload;
    },
    setErrorType: (state, action: PayloadAction<ErrorType>) => {
      state.errorType = action.payload;
    },
    clearErrorType: (state) => {
      state.errorType = null;
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
        state.errorType = ErrorType.LoadError;
      })
      .addCase(addTodo.fulfilled, (state, action: PayloadAction<Todo>) => {
        console.log(action.payload, 'action in redux');
        state.todos.push(action.payload);
      })
      .addCase(addTodo.rejected, (state) => {
        state.errorType = ErrorType.AddTodoError;
      })
      .addCase(deleteTodo.fulfilled, (state, action) => {
        console.log(action.payload, 'action in redux');
        state.todos = state.todos.filter(todo => todo.id !== action.payload);
      })
      .addCase(deleteTodo.rejected, (state, action) => {
        console.log(action.payload, 'action in redux');
        state.errorType = ErrorType.DeleteTodoError;
      });
  },
});

export const {
  setTempTodo,
  setInputValue,
  clearTempTodo,
  setFilter,
  setErrorType,
  clearErrorType,
} = todoSlice.actions;

export default todoSlice.reducer;
