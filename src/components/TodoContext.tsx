import React, { createContext, useEffect, useReducer } from 'react';

import { USER_ID, getTodos } from '../api/todos';
import { useAutoClearError } from '../utils/useAutoClearError';
import { Todo } from '../types/Todo';
import { TodoStatus } from '../types/TodoStatus';
import { TodoErrors } from '../types/TodoErrors';

export type Action =
  | { type: 'LOAD_TODOS'; payload: Todo[] }
  | { type: 'ADD_TODO'; title: string; id: number }
  | { type: 'DELETE_TODO'; id: number }
  | { type: 'EDIT_TODO'; id: number; title: string }
  | { type: 'SET_TEMP_TODO'; title: string }
  | { type: 'DELETE_TEMP_TODO' }
  | { type: 'TOGGLE_TODO'; id: number }
  | { type: 'TOGGLE_ALL' }
  | { type: 'SET_FILTER'; filter: TodoStatus }
  | { type: 'SET_ERROR'; error: TodoErrors | null }
  | { type: 'SET_LOADER'; id: number }
  | { type: 'REMOVE_LOADER'; id: number };

const todoReducer = (state: typeof initialState, action: Action) => {
  switch (action.type) {
    case 'LOAD_TODOS':
      return {
        ...state,
        todos: action.payload,
      };

    case 'ADD_TODO':
      return {
        ...state,
        todos: [
          ...state.todos,
          {
            id: action.id,
            title: action.title.trim(),
            completed: false,
            userId: USER_ID,
          },
        ],
      };

    case 'DELETE_TODO':
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.id),
      };

    case 'EDIT_TODO':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.id
            ? { ...todo, title: action.title.trim() }
            : todo,
        ),
      };

    case 'SET_TEMP_TODO':
      return {
        ...state,
        tempTodo: {
          id: 0,
          title: action.title.trim(),
          completed: false,
          userId: USER_ID,
          isLoading: true,
        },
      };

    case 'DELETE_TEMP_TODO':
      return {
        ...state,
        tempTodo: null,
      };

    case 'TOGGLE_TODO':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.id
            ? { ...todo, completed: !todo.completed }
            : todo,
        ),
      };

    case 'TOGGLE_ALL':
      const areAllCompleted = state.todos.every(todo => todo.completed);

      return {
        ...state,
        todos: state.todos.map(todo => ({
          ...todo,
          completed: !areAllCompleted,
        })),
      };

    case 'SET_FILTER':
      return { ...state, filter: action.filter };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.error,
      };

    case 'SET_LOADER':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.id
            ? { ...todo, isLoading: true }
            : { ...todo, isLoading: false },
        ),
      };

    case 'REMOVE_LOADER':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.id
            ? { ...todo, isLoading: false }
            : { ...todo, isLoading: false },
        ),
      };

    default:
      return state;
  }
};

const initialState: {
  todos: Todo[];
  filter: TodoStatus;
  error: TodoErrors | null;
  tempTodo: Todo | null;
} = {
  todos: [],
  filter: TodoStatus.All,
  error: null,
  tempTodo: null,
};

export const TodoContext = createContext<{
  state: typeof initialState;
  dispatch: React.Dispatch<Action>;
}>({ state: initialState, dispatch: () => {} });

type Props = {
  children: React.ReactNode;
};

export const TodoProvider: React.FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(todoReducer, initialState);

  useAutoClearError(dispatch, state.error);

  useEffect(() => {
    (async () => {
      try {
        const todos = await getTodos();

        dispatch({ type: 'LOAD_TODOS', payload: todos });
        dispatch({ type: 'SET_ERROR', error: null });
      } catch {
        dispatch({ type: 'SET_ERROR', error: TodoErrors.LOAD_TODOS });
      }
    })();
  }, [dispatch]);

  return (
    <TodoContext.Provider value={{ state, dispatch }}>
      {children}
    </TodoContext.Provider>
  );
};
