import React, { useReducer } from 'react';
import { Todo } from '../types/Todo';
import { Filter } from '../types/Filter';

type State = {
  errorMessage: string | null;
  todos: Todo[];
  todosForUpdateIds: number[],
  filterBy: Filter;
  tempTodo: Todo | null,
};

type Props = {
  children: React.ReactNode;
};

export type Action
  = { type: 'saveTodos', payload: Todo[] }
  | { type: 'saveTodosForUpdateId', payload: number[] }
  | { type: 'addTodo', payload: Todo }
  | { type: 'deleteTodo', payload: number }
  | { type: 'updateTodo', payload: Todo }
  | { type: 'setError', payload: string | null }
  | { type: 'setFilter', payload: Filter }
  | { type: 'setTempTodo', payload: Todo | null };

export const initialState: State = {
  todos: [],
  todosForUpdateIds: [],
  filterBy: Filter.all,
  errorMessage: null,
  tempTodo: null,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'saveTodos':
      return {
        ...state,
        todos: action.payload,
        tempTodo: null,
      };

    case 'saveTodosForUpdateId':
      return {
        ...state,
        todosForUpdateIds: action.payload,
      };

    case 'addTodo':
      return {
        ...state,
        todos: [...state.todos, action.payload],
      };

    case 'deleteTodo':
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload),
      };

    case 'updateTodo':
      return {
        ...state,
        todos: state.todos.map(todo => {
          if (todo.id === action.payload.id) {
            return action.payload;
          }

          return todo;
        }),
      };

    case 'setError':
      return {
        ...state,
        errorMessage: action.payload,
      };

    case 'setFilter':
      return {
        ...state,
        filterBy: action.payload,
      };

    case 'setTempTodo':
      return {
        ...state,
        tempTodo: action.payload,
      };

    default:
      return state;
  }
}

export const StateContext = React.createContext(initialState);
export const DispatchContext
  = React.createContext((() => { }) as React.Dispatch<Action>);

export const GlobalProvider: React.FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>
        {children}
      </StateContext.Provider>
    </DispatchContext.Provider>
  );
};
