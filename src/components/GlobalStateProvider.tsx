import React from 'react';

import { State } from '../types/State';
import { Action } from '../types/Action';

const initialState: State = {
  todos: [],
  filter: 'all',
  selectedTodo: null,
  title: '',
  selectedTitle: '',
  error: '',
};

const reducer = (state: State, { type, payload }: Action): State => {
  switch (type) {
    case 'SET_TODOS':
      return {
        ...state,
        todos: payload,
      };

    case 'ADD_TODO':
      return {
        ...state,
        todos: [...state.todos, payload],
      };

    case 'UPDATE_TODO':
      const patchedTodos = state.todos.map(todo =>
        todo.id === payload.id ? payload : todo,
      );

      return {
        ...state,
        todos: patchedTodos,
        selectedTodo: null,
      };

    case 'DELETE_TODO':
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== payload.id),
      };

    case 'SET_SELECTED_TODO':
      return {
        ...state,
        selectedTodo: payload,
      };

    case 'SET_TITLE':
      return {
        ...state,
        title: payload,
      };

    case 'SET_SELECTED_TITLE':
      return {
        ...state,
        selectedTitle: payload,
      };

    case 'SET_FILTER':
      return {
        ...state,
        filter: payload,
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: payload,
      };

    case 'SET_LOADING':
      const todos = state.todos.map(todo => {
        return todo.id === payload.id
          ? { ...todo, loading: payload.loading }
          : todo;
      });

      return {
        ...state,
        todos: todos,
      };

    default:
      return state;
  }
};

const StateContext = React.createContext(initialState);
//eslint-disable-next-line
const DispatchContext = React.createContext((_action: Action) => {});

type Props = {
  children: React.ReactNode;
};

export const GlobalStateProvider: React.FC<Props> = ({ children }) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
};

export const useStateContext = () => React.useContext(StateContext);
export const useDispatchContext = () => React.useContext(DispatchContext);
