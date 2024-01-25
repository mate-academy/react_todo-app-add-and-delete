import React, { useReducer } from 'react';
import { Todo } from '../types/Todo';
import { Filter } from '../types/Filter';

type State = {
  updatedAt: Date;
  errorMessage: string | null;
  todos: Todo[];
  activeTodos: number;
  clearAll: boolean;
  filterBy: Filter;
  isSubmitting: boolean;
  isEscapeKeyup: boolean;
  setAllCompleted: boolean,
  tempTodo: Todo | null,
};

type Props = {
  children: React.ReactNode;
};

export type Action
  = { type: 'updatedAt' }
  | { type: 'setError', payload: string | null }
  | { type: 'clearAll', payload: boolean }
  | { type: 'saveTodos', payload: { todos: Todo[], activeTodos: number } }
  | { type: 'setFilter', payload: Filter }
  | { type: 'setIsSubmitting', payload: boolean }
  | { type: 'setEscape', payload: boolean }
  | { type: 'setTodosStatus', payload: boolean }
  | { type: 'setTempTodo', payload: Todo | null }
  | { type: 'addActiveTodo', payload: Todo }
  | { type: 'deleteTodo', payload: number }
  | { type: 'updateTodo', payload: Todo };

export const initialState: State = {
  updatedAt: new Date(),
  errorMessage: null,
  todos: [],
  activeTodos: 0,
  clearAll: false,
  filterBy: Filter.all,
  isSubmitting: false,
  isEscapeKeyup: false,
  setAllCompleted: false,
  tempTodo: null,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'saveTodos':
      return {
        ...state,
        todos: action.payload.todos,
        tempTodo: null,
        activeTodos: action.payload.activeTodos,
        setAllCompleted: !!action.payload.todos.length || state.setAllCompleted,
      };

    case 'updatedAt':
      return {
        ...state,
        updatedAt: new Date(),
      };

    case 'clearAll':
      return {
        ...state,
        clearAll: action.payload,
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

    case 'setIsSubmitting':
      return {
        ...state,
        isSubmitting: action.payload,
      };

    case 'setEscape':
      return {
        ...state,
        isEscapeKeyup: action.payload,
      };

    case 'setTodosStatus':
      return {
        ...state,
        setAllCompleted: action.payload,
      };

    case 'setTempTodo':
      return {
        ...state,
        tempTodo: action.payload,
      };

    case 'addActiveTodo':
      return {
        ...state,
        activeTodos: state.activeTodos + 1,
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
        // todos: state.todos.map(todo =>  )
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
