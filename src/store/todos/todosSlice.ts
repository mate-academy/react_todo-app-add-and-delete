/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Todo from '../../models/Todo';
import FilterTypes from '../../types/FilterTypes';
import TodosAsync from './todosAsync';

export interface State {
  todos: Todo[] | null;
  filter: FilterTypes;
  error: string;
  loadingTodosIds: number[];
}

const initialState: State = {
  todos: null,
  filter: FilterTypes.All,
  error: '',
  loadingTodosIds: [],
};

export const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    setLoadingTodos: (state:State, action:PayloadAction<number[]>) => {
      state.loadingTodosIds = action.payload;
    },
    setFilter: (state:State, action:PayloadAction<FilterTypes>) => {
      state.filter = action.payload;
    },
    setError: (state:State, action:PayloadAction<string>) => {
      state.error = action.payload;
    },
    setInitialField: <StateKey extends keyof State>
    (state: State, action: PayloadAction<StateKey>) => {
      state[action.payload] = initialState[action.payload];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(
        TodosAsync.fetchTodos.fulfilled,
        (state: State, action: PayloadAction<Todo[]>) => {
          state.todos = action.payload;
        },
      )
      .addCase(
        TodosAsync.createTodo.fulfilled,
        (state: State, action: PayloadAction<Todo>) => {
          state.todos = state.todos
            ? [action.payload, ...state.todos]
            : [action.payload];
        },
      )
      .addCase(TodosAsync.createTodo.rejected, (state:State) => {
        state.error = 'Unable to add a todo';
      })
      .addCase(
        TodosAsync.updateTodo.fulfilled,
        (state: State, action: PayloadAction<Todo>) => {
          state.todos = state.todos
            ? state.todos.map((todo) => {
              return todo.id === action.payload.id ? action.payload : todo;
            })
            : state.todos;
        },
      )
      .addCase(TodosAsync.updateTodo.rejected, (state:State) => {
        state.error = 'Unable to update a todo';
      })
      .addCase(
        TodosAsync.deleteTodo.fulfilled,
        (state: State, action) => {
          const todoId = action.meta.arg;

          state.todos = state.todos
            ? state.todos.filter(todo => todo.id !== todoId)
            : state.todos;
        },
      )
      .addCase(TodosAsync.deleteTodo.rejected, (state:State) => {
        state.error = 'Unable to delete a todo';
      });
  },
});

export const todosActions = todosSlice.actions;

export default todosSlice.reducer;
