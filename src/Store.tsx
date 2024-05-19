import React, { PropsWithChildren, useEffect, useReducer } from 'react';

import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import { getTodos } from './api/todos';

type Action =
  | { type: 'add'; payload: Todo }
  | { type: 'set-todos'; payload: Todo[] }
  | { type: 'remove'; payload: number }
  | { type: 'set-complete'; payload: { id: number; completed: boolean } }
  | { type: 'set-title'; payload: { id: number; title: string } }
  | { type: 'set-filter'; payload: Filter }
  | { type: 'set-error'; payload: string };

interface State {
  todos: Todo[];
  filter: Filter;
  error: string;
}

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'set-filter':
      return {
        ...state,
        filter: action.payload,
      };
    case 'add':
      return {
        ...state,
        todos: [...state.todos, action.payload],
      };
    case 'set-todos':
      return {
        ...state,
        todos: action.payload,
      };
    case 'remove':
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload),
      };
    case 'set-error':
      return {
        ...state,
        error: action.payload,
      };
    case 'set-complete':
      const toggledTodo = state.todos.find(
        todo => todo.id === action.payload.id,
      );

      if (toggledTodo) {
        toggledTodo.completed = action.payload.completed;
      }

      return {
        ...state,
        todos: [...state.todos],
      };
    case 'set-title':
      const titledTodo = state.todos.find(
        todo => todo.id === action.payload.id,
      );

      if (titledTodo) {
        titledTodo.title = action.payload.title;
      }

      return {
        ...state,
        todos: [...state.todos],
      };
    default:
      return state;
  }
};

const initialState: State = {
  todos: [],
  filter: Filter.ALL,
  error: '',
};

export const StateContex = React.createContext(initialState);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const DispatchContex = React.createContext((_action: Action) => {});

export const GlobalStateProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    getTodos()
      .then(todosFromServer =>
        dispatch({ type: 'set-todos', payload: todosFromServer }),
      )
      .catch(() =>
        dispatch({ type: 'set-error', payload: 'Unable to load todos' }),
      );
  }, []);

  return (
    <DispatchContex.Provider value={dispatch}>
      <StateContex.Provider value={state}>{children}</StateContex.Provider>
    </DispatchContex.Provider>
  );
};
