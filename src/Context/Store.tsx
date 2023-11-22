import React, { useEffect, useReducer } from 'react';
import { Todo } from '../types/Todo';
import { Error } from '../types/Error';
import { getTodos } from '../api/todos';

type Action = { type: 'loadTodos', payload: Todo[] }
| { type: 'setError', payload: Error }
| { type: 'tempTodo', payload: Todo | null }
| { type: 'addTodo', payload: Todo }
| { type: 'deleteTodo', payload: Todo }
| { type: 'clearCompleted' };

interface State {
  todos: Todo[];
  tempTodo: Todo | null;
  error: Error;
  userId: number;
}

export const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'loadTodos':
      return {
        ...state,
        todos: action.payload,
      };
    case 'addTodo':
      return {
        ...state,
        todos: [...state.todos, action.payload],
      };
    case 'tempTodo':
      return {
        ...state,
        tempTodo: action.payload,
      };
    case 'deleteTodo':
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload.id),
      };
    case 'clearCompleted':
      return {
        ...state,
        todos: state.todos.filter(todo => !todo.completed),
      };
    case 'setError':
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

const initialState: State = {
  todos: [],
  tempTodo: null,
  error: Error.Default,
  userId: 7023,
};

export const StateContext = React.createContext(initialState);
export const DispatchContext
  = React.createContext<React.Dispatch<Action>>(() => { });

type Props = {
  children: React.ReactNode;
};

export const GlobalStateProvider: React.FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    getTodos(state.userId)
      .then(response => dispatch({
        type: 'loadTodos',
        payload: response,
      }))
      .catch(() => dispatch({
        type: 'setError',
        payload: Error.UnableLoadTodos,
      }));
    setTimeout(() => dispatch({
      type: 'setError',
      payload: Error.Default,
    }), 3000);
  }, [dispatch, state.userId]);

  useEffect(() => {
    setTimeout(() => dispatch({
      type: 'setError',
      payload: Error.Default,
    }), 3000);
  }, [state.error]);

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>
        {children}
      </StateContext.Provider>
    </DispatchContext.Provider>
  );
};
