import React, { useEffect, useReducer } from 'react';
import { Todo } from '../types/Todo';
import { USER_ID, addTodo, deleteTodo, getTodos } from '../api/todos';

export type Action =
  | { type: 'setTodoApi'; payload: Todo[] }
  | { type: 'setError'; error: string }
  | { type: 'setQuery'; value: string }
  | { type: 'addTodo' }
  | { type: 'setSelect'; action: string }
  | { type: 'setFetch'; value: boolean }
  | { type:  'deleteTodo'; currentId: number }
  | { type: 'disableFetch' };

interface State {
  todoApi: Todo[];
  select: string;
  selectedAll: boolean;
  error: string;
  query: string;
  fetch: boolean;
  currentId: number;
}

export const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'setTodoApi':
      return {
        ...state,
        todoApi: action.payload,
      };

    case 'setError':
      return {
        ...state,
        error: action.error,
      };

    case 'setQuery':
      return {
        ...state,
        query: action.value,
      };

    case 'addTodo':
      const newTodo: Omit<Todo, 'id'> = {
        userId: USER_ID,
        title: state.query,
        completed: false,
      };

      if (!state.query.trim()){
        return {
          ...state,
          fetch: true,
          error: 'Title should not be emptys'
        }
      }

      addTodo(newTodo)
        .catch(() => {
          return {
            ...state,
            error: 'Unable to add a todo'
          }
        })

      return {
        ...state,
        query: '',
        fetch: true,
      };

    case 'setSelect':
      return {
        ...state,
        select: action.action,
      };

    case 'setFetch':
      return {
        ...state,
        fetch: action.value,
      };

    case 'deleteTodo':
      deleteTodo(action.currentId).catch(() => {
        return {
          ...state,
          error: 'Unable to delete a todo'
        }
      })

      return {
        ...state,
        cuurrentId: action.currentId,
        fetch: true,
      };

    case 'disableFetch':
      return {
        ...state,
        fetch: false,
      }

    default:
      return state;
  }


};

const initialState: State = {
  todoApi: [],
  select: 'All',
  selectedAll: false,
  error: '',
  query: '',
  fetch: false,
  currentId: 0,
};

export const StateContext = React.createContext(initialState);
export const DispatchContext = React.createContext((_action: Action) => {});

interface Props {
  children: React.ReactNode;
}

export const GlobalProvider: React.FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const deleteAfterShowError = () => {
    setTimeout(() => dispatch({ type: 'setError', error: '' }), 3000);
  };

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    if (state.error.length) {
       deleteAfterShowError()
     }

      getTodos()
        .then((todos) => {
          if (mounted) {
            dispatch({ type: 'setTodoApi', payload: todos });
            dispatch({ type: 'setFetch', value: false });
          }
        })
        .catch(() => {
          if (mounted) {
            dispatch({ type: 'setTodoApi', payload: [] });
            dispatch({ type: 'setError', error: 'Unable to load todos' });
          }
        }).finally(() => dispatch({type: 'disableFetch'}));

    return () => {
      mounted = false;
      controller.abort();
    };
  }, [state.fetch]);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
};
