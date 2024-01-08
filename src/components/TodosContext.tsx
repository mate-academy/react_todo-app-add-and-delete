import React, { useEffect, useReducer } from 'react';
import { Todo } from '../types/Todo';
import { Status } from '../types/Status';
import { getTodos } from '../api/todos';
import { ERROR_DELAY, USER_ID } from '../utils/constants';

type Action = { type: 'load', payload: Todo[] }
| { type: 'addTodo', payload: Todo }
| { type: 'deleteTodo', payload: number }
| { type: 'addTempTodo', payload: Todo | null }
| { type: 'clearCompleted' }
| { type: 'setFilter', payload: Status }
| { type: 'changeCompleted', payload: number }
| { type: 'changeAllCompleted', payload: boolean }
| { type: 'setLoading', payload: { isLoading: boolean, todoIds?: number[] } }
| { type: 'hideErrorMessage' }
| { type: 'setErrorMessage', payload: string };

interface State {
  todos: Todo[];
  tempTodo: Todo | null;
  filterBy: Status;
  isError: boolean;
  errorMessage: string;
  loading: { isLoading: boolean, todoIds: number[] };
}

const initialState: State = {
  todos: [],
  tempTodo: null,
  filterBy: Status.ALL,
  isError: false,
  errorMessage: '',
  loading: { isLoading: false, todoIds: [] },
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case ('load'):
      return {
        ...state,
        todos: action.payload,
      };

    case ('addTempTodo'):
      return {
        ...state,
        tempTodo: action.payload,
      };

    case ('addTodo'):
      return {
        ...state,
        todos: [...state.todos, action.payload],
      };

    case ('deleteTodo'):
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload),
      };

    case ('clearCompleted'):
      return {
        ...state,
        todos: state.todos.filter(todo => !todo.completed),
      };

    case ('changeCompleted'):
      return {
        ...state,
        todos: state.todos.map(todo => {
          if (todo.id === action.payload) {
            return {
              ...todo,
              completed: !todo.completed,
            };
          }

          return todo;
        }),
      };

    case ('changeAllCompleted'):
      return {
        ...state,
        todos: state.todos.map(todo => {
          return {
            ...todo,
            completed: !action.payload,
          };
        }),
      };

    case ('setLoading'):
      if (action.payload.isLoading && action.payload.todoIds) {
        return {
          ...state,
          loading: {
            isLoading: action.payload.isLoading,
            todoIds: action.payload.todoIds,
          },
        };
      }

      return {
        ...state,
        loading: {
          isLoading: action.payload.isLoading,
          todoIds: [],
        },
      };

    case ('setErrorMessage'):
      return {
        ...state,
        errorMessage: action.payload,
        isError: true,
      };

    case ('setFilter'):
      return {
        ...state,
        filterBy: action.payload,
      };

    case ('hideErrorMessage'):
      return {
        ...state,
        isError: false,
      };

    default:
      return state;
  }
}

export const StateContext = React.createContext(initialState);
export const DispatchContext
  = React.createContext<(action: Action) => void>(() => { });

type Props = {
  children: React.ReactNode;
};

export const GlobalStateProvider: React.FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { isError } = state;

  useEffect(() => {
    getTodos(USER_ID)
      .then((response) => (
        dispatch({ type: 'load', payload: response })
      ))
      .catch(() => (
        dispatch({
          type: 'setErrorMessage',
          payload: 'Unable to load todos',
        })
      ));
  }, []);

  useEffect(() => {
    const timeoutId = 0;

    if (isError) {
      setTimeout(() => {
        dispatch({ type: 'hideErrorMessage' });
      }, ERROR_DELAY);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [isError, dispatch]);

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>
        {children}
      </StateContext.Provider>
    </DispatchContext.Provider>
  );
};
