import React, { useEffect, useReducer } from 'react';
import { USER_ID, getTodos } from '../api/todos';
import { FilterBy } from '../enums/FilterBy';
import { State } from '../types/State';
import { Action } from '../types/Action';
import { Todo } from '../types/Todo';

const initialState: State = {
  todos: [],
  sortBy: FilterBy.All,
  status: 'SUCCESS',
};

const newTodo = (title: string): Todo => {
  return {
    id: +new Date(),
    userId: USER_ID,
    title,
    completed: false,
  };
};

function reducer(state: State, action: Action) {
  switch (action.type) {
    case 'SHOW_ALL':
      return {
        ...state,
        sortBy: FilterBy.All,
      };
    case 'LOAD_TODOS':
      return {
        ...state,
        todos: action.payload,
      };
    case 'DELETE_TODO': {
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload.id),
      };
    }

    case 'ADD_NEW_TODO':
      return {
        ...state,
        todos: [...state.todos, newTodo(action.payload.title.trim())],
      };
    case 'REMOVE_LOCAL_TODO':
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload.id),
      };
    case 'SHOW_ERROR_MESSAGE':
      return {
        ...state,
        status: action.payload.message,
      };
    case 'SHOW_COMPLETED':
      return {
        ...state,
        sortBy: FilterBy.Completed,
      };
    case 'SHOW_ACTIVE':
      return {
        ...state,
        sortBy: FilterBy.Active,
      };
    default:
      return state;
  }
}

export const DispatchContext = React.createContext<(action: Action) => void>(
  () => {},
);
export const StateContext = React.createContext<State>(initialState);

type Props = {
  children: React.ReactNode;
};

export const GlobalStateProvider: React.FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    getTodos()
      .then(response => {
        return dispatch({ type: 'LOAD_TODOS', payload: response });
      })
      .catch(() =>
        dispatch({
          type: 'SHOW_ERROR_MESSAGE',
          payload: { message: 'Unable to load todos' },
        }),
      );
  }, []);

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>{children}</StateContext.Provider>
    </DispatchContext.Provider>
  );
};
