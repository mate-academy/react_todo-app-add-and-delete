import React, { useReducer } from 'react';
import { Todo } from '../types/Todo';
import { USER_ID } from '../api/todos';
import { IsUseTodos } from '../types/IsUseTodos';

interface State {
  todos: Todo[];
  focusNewTodo: boolean;
  useTodos: 'All' | 'Active' | 'Completed';
  changerTodo: string;
  changerId: number;
  errorsInTodo: string;
  idTodoSubmitting: number;
  vaitTodoId: number[];
}

export type Action =
  | { type: 'setAllTodos'; todos: Todo[] }
  | { type: 'AddTodo'; title: string }
  | { type: 'removeTodo'; id: number }
  | { type: 'SetCheckedTodo'; id: number }
  | { type: 'setChangedTodoId'; id: number }
  | { type: 'changedTodoFromId'; id: number; text: string }
  | { type: 'setAllCompleate'; use: boolean }
  | { type: 'setUseTodos'; name: IsUseTodos }
  | { type: 'setFocudNewTodo' }
  | { type: 'escapeChangedText'; id: number }
  | { type: 'setError'; error: string }
  | { type: 'setIdTodoSelection'; id: number }
  | { type: 'setVaitTodoId'; id: number | number[] }
  | { type: 'deleteVaitTodoId'; id: number };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'setAllTodos':
      return {
        ...state,
        todos: action.todos,
      };

    case 'AddTodo':
      const todoId = +new Date();

      return {
        ...state,
        todos: [
          ...state.todos,
          {
            id: todoId,
            title: action.title.trim(),
            completed: false,
            userId: USER_ID,
          },
        ],
        idTodoSubmitting: todoId,
      };

    case 'removeTodo':
      return {
        ...state,
        todos: [
          ...state.todos.filter(todo => {
            return action.id !== 0
              ? todo.id !== action.id
              : todo.id !== state.idTodoSubmitting;
          }),
        ],
        focusNewTodo: !state.focusNewTodo,
      };

    case 'SetCheckedTodo':
      return {
        ...state,
        todos: [
          ...state.todos.map(todo => {
            if (todo.id === action.id) {
              return {
                ...todo,
                completed: !todo.completed,
              };
            } else {
              return todo;
            }
          }),
        ],
      };

    case 'setChangedTodoId':
      return {
        ...state,
        changerId: action.id,
        changerTodo:
          state.todos.find(todo => todo.id === action.id)?.title || '',
      };

    case 'changedTodoFromId':
      return {
        ...state,
        todos: [
          ...state.todos.map(todo => {
            if (todo.id === action.id) {
              return {
                ...todo,
                title: action.text,
              };
            } else {
              return todo;
            }
          }),
        ],
      };

    case 'setAllCompleate':
      return {
        ...state,
        todos: [
          ...state.todos.map(todo => {
            return {
              ...todo,
              completed: !action.use,
            };
          }),
        ],
      };

    case 'setUseTodos':
      return {
        ...state,
        useTodos: action.name,
      };

    case 'setFocudNewTodo':
      return {
        ...state,
        focusNewTodo: !state.focusNewTodo,
      };

    case 'escapeChangedText':
      return {
        ...state,
        todos: [
          ...state.todos.map(todo => {
            if (todo.id === action.id) {
              return {
                ...todo,
                title: state.changerTodo,
              };
            } else {
              return todo;
            }
          }),
        ],
      };

    case 'setError':
      return {
        ...state,
        errorsInTodo: action.error,
      };

    case 'setIdTodoSelection':
      return {
        ...state,
        idTodoSubmitting: action.id,
      };

    case 'setVaitTodoId':
      return {
        ...state,
        vaitTodoId:
          typeof action.id === 'number'
            ? [...state.vaitTodoId, action.id]
            : [...state.vaitTodoId, ...action.id],
      };

    case 'deleteVaitTodoId':
      return {
        ...state,
        vaitTodoId: [...state.vaitTodoId.filter(id => id !== action.id)],
      };

    default:
      return state;
  }
};

const initialState: State = {
  todos: [],
  useTodos: 'All',
  focusNewTodo: true,
  changerTodo: '',
  changerId: 0,
  errorsInTodo: '',
  idTodoSubmitting: 0,
  vaitTodoId: [],
};

const defaultDispatch: React.Dispatch<Action> = () => {};

export const StateContext = React.createContext(initialState);
export const DispatchContext = React.createContext(defaultDispatch);

type Props = {
  children: React.ReactNode;
};

export const GlobalstateProvider: React.FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>{children}</StateContext.Provider>
    </DispatchContext.Provider>
  );
};
