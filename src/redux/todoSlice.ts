/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Todo } from '../types/Todo';
import { TodoFilter } from '../types/TodoFilter';
import { ErrorType } from '../types/errorType';
import {
  fetchTodos,
  addTodo,
  deleteTodo,
  setCompletion,
} from './todoThunks';
import { USER_ID } from '../_utils/constants';

export interface TodoState {
  todos: Todo[];
  tempTodo: Todo | null;
  inputValue: string,
  status: 'idle' | 'loading' | 'failed';
  error: string | null;
  filter: TodoFilter;
  errorType: ErrorType | null;
  deletingTodoIds: number[];
  updatingTodoIds: number[];
}

const initialState: TodoState = {
  todos: [],
  tempTodo: null,
  inputValue: '',
  status: 'idle',
  error: null,
  filter: TodoFilter.All,
  errorType: null,
  deletingTodoIds: [],
  updatingTodoIds: [],
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
      .addCase(addTodo.pending, (state, action) => {
        state.tempTodo = {
          ...action.meta.arg,
          id: 0,
          completed: false,
          userId: USER_ID,
        };
        state.status = 'loading';
      })
      .addCase(addTodo.fulfilled, (state, action: PayloadAction<Todo>) => {
        console.log(action.payload, 'api request to add todo fullfiled');
        state.todos.push(action.payload);
      })
      .addCase(addTodo.rejected, (state) => {
        state.errorType = ErrorType.AddTodoError;
      })
      .addCase(deleteTodo.pending, (state, action) => {
        state.deletingTodoIds.push(action.meta.arg);
      })
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.deletingTodoIds = state.deletingTodoIds
          .filter(id => id !== action.meta.arg);
        state.todos = state.todos
          .filter(todo => todo.id !== action.payload);
      })
      .addCase(deleteTodo.rejected, (state, action) => {
        state.deletingTodoIds = state.deletingTodoIds
          .filter(id => id !== action.meta.arg);

        state.errorType = ErrorType.DeleteTodoError;
      })
      .addCase(setCompletion.pending, (state, action) => {
        state.updatingTodoIds.push(action.meta.arg.todoId);
      })
      .addCase(setCompletion.fulfilled, (state, action) => {
        const { id, completed } = action.payload;
        const existingTodo = state.todos.find(todo => todo.id === id);

        if (existingTodo) {
          existingTodo.completed = completed;
        }

        state.updatingTodoIds = state.updatingTodoIds
          .filter(todoId => todoId !== id);
      })
      .addCase(setCompletion.rejected, (state, action) => {
        state.updatingTodoIds = state.updatingTodoIds
          .filter(todoId => todoId !== action.meta.arg.todoId);

        state.errorType = ErrorType.UpdateTodoError;
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
