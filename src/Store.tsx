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
  deleteCompletedId = 'deleteCompletedId',
  setIsRemoving = 'setIsRemoving',
  setCompletedIds = 'setCompletedIds',
}

type Action =
  | { type: Actions.postTodo; post: Todo }
  | { type: Actions.deleteTodo; id: number }
  | { type: Actions.deleteCompletedId; id: number }
  | { type: Actions.addTempTodo; preparingTodo: Todo | null }
  | { type: Actions.loadTodos; todos: Todo[] }
  | { type: Actions.markCompleted; id: number }
  | { type: Actions.changeTodosStatus; filterValue: string }
  | { type: Actions.setErrorLoad; payload: string }
  | { type: Actions.isAdding; status: boolean }
  | { type: Actions.setIsRemoving; status: boolean }
  | { type: Actions.setCompletedIds; ids: number[] };

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
    case Actions.deleteCompletedId:
      return {
        ...state,
        todos: todos.filter(todo => todo.id !== action.id),
      };
    case Actions.addTempTodo:
      return {
        ...state,
        tempTodo: action.preparingTodo
          ? { ...action.preparingTodo, id: state.todos.length + 1 }
          : null,
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
    case Actions.setIsRemoving:
      return { ...state, isRemoving: action.status };
    case Actions.setCompletedIds:
      return { ...state, completedIds: action.ids };
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
    { todos, filterStatus, errorLoad, tempTodo, isAdding, isRemoving },
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
          isRemoving,
        }}
      >
        {children}
      </StateContext.Provider>
    </DispatchContext.Provider>
  );
};
