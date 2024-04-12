import React, { useReducer } from 'react';
import { Todo } from './types/Todo';

export enum Actions {
  postTodo = 'postTodo',
  addTempTodo = 'addTempTodo',
  markCompleted = 'markCompleted',
  changeTodosStatus = 'changeTodosStatus',
  setErrorLoad = 'setErrorLoad',
  loadTodos = 'loadTodos',
  isAdding = 'isAdding',
  isRemoving = 'isRemoving',
  deleteTodo = 'deleteTodo',
  deleteCompleted = 'deleteCompleted',
}

type Action =
  | { type: Actions.postTodo; post: Todo }
  | { type: Actions.deleteTodo; id: number }
  | { type: Actions.deleteCompleted }
  | { type: Actions.addTempTodo; preparingTodo: Todo | null }
  | { type: Actions.loadTodos; todos: Todo[] }
  | { type: Actions.markCompleted; id: number }
  | { type: Actions.changeTodosStatus; filterValue: string }
  | { type: Actions.setErrorLoad; payload: string }
  | { type: Actions.isAdding; status: boolean };

export enum FilterValue {
  All = 'all',
  Completed = 'completed',
  Active = 'active',
}

interface State {
  todos: Todo[];
  tempTodo: Todo | null;
  filterStatus: string;
  errorLoad: string;
  isAdding: boolean;
  completedTodos: number[];
  isRemoving: boolean;
}

function reducer(state: State, action: Action) {
  const { todos } = state;

  switch (action.type) {
    case Actions.postTodo:
      return {
        ...state,
        todos: [...todos, action.post],
      };
    case Actions.deleteTodo:
      return {
        ...state,
        todos: todos.filter(todo => todo.id !== action.id),
      };
    case Actions.deleteCompleted:
      const completedIds = todos
        .filter(todo => todo.completed)
        .map(todo => todo.id);

      return {
        ...state,
        todos: todos.filter(todo => !todo.completed),
        completedTodos: [...state.completedTodos, ...completedIds],
        isRemoving: true,
      };
    case Actions.addTempTodo:
      return {
        ...state,
        tempTodo: action.preparingTodo,
      };
    case Actions.markCompleted:
      return {
        ...state,
        todos: todos.map(t =>
          t.id === action.id ? { ...t, completed: !t.completed } : t,
        ),
      };
    case Actions.changeTodosStatus:
      return {
        ...state,
        filterStatus: action.filterValue,
      };
    case Actions.setErrorLoad:
      return {
        ...state,
        errorLoad: action.payload,
      };
    case Actions.loadTodos:
      return { ...state, todos: action.todos };
    case Actions.isAdding:
      return { ...state, isAdding: action.status };
    default:
      return state;
  }
}

const initialState: State = {
  todos: [],
  filterStatus: FilterValue.All,
  errorLoad: '',
  tempTodo: null,
  isAdding: false,
  completedTodos: [],
  isRemoving: false,
};

export const StateContext = React.createContext(initialState);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const DispatchContext = React.createContext((_action: Action) => {});

type Props = {
  children: React.ReactNode;
};

export const GlobalStateProvider: React.FC<Props> = ({ children }) => {
  const [
    {
      todos,
      filterStatus,
      errorLoad,
      tempTodo,
      isAdding,
      completedTodos,
      isRemoving,
    },
    dispatch,
  ] = useReducer(reducer, initialState);

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider
        value={{
          todos,
          filterStatus,
          errorLoad,
          tempTodo,
          isAdding,
          completedTodos,
          isRemoving,
        }}
      >
        {children}
      </StateContext.Provider>
    </DispatchContext.Provider>
  );
};
