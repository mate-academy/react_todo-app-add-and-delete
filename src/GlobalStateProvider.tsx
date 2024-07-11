import React, { useReducer } from 'react';
import { Action, Type } from './types/Action';
import { Status } from './types/Status';
import { State } from './types/State';

const initialState: State = {
  todos: [],
  status: Status.all,
  title: '',
  editingId: undefined,
  loading: false,
  errorMessage: '',
  isSubmitting: false,
  tempTodo: null,
  deletedTodos: [],
  resetDeletedTodos: [],
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case Type.DeleteTodo:
      return {
        ...state,
        todos: [...state.todos.filter(todo => todo.id !== action.payload.id)],
      };

    case Type.ClearCompleted:
      return {
        ...state,
        todos: [...state.todos.filter(todo => !todo.completed)],
      };

    case Type.ToggleAllChecked:
      const allChecked = state.todos.every(todo => todo.completed);

      return {
        ...state,
        todos: [
          ...state.todos.map(todo => ({ ...todo, completed: !allChecked })),
        ],
      };

    case Type.AddTodo:
      return {
        ...state,
        todos: [...state.todos, action.payload],
      };

    case Type.setTodos:
      return {
        ...state,
        todos: [...action.payload],
      };

    case Type.UpdateTodo:
      return {
        ...state,
        todos: [
          ...state.todos.map(item =>
            item.id === action.payload.id
              ? { ...item, title: action.payload.title }
              : item,
          ),
        ],
      };

    case Type.UpdateTodoCheckStatus:
      const index = state.todos.findIndex(
        item => item.id === action.payload.id,
      );
      const updatedTodos = [...state.todos];

      updatedTodos[index] = action.payload;

      return {
        ...state,
        todos: [...updatedTodos],
      };

    case Type.setStatus:
      return {
        ...state,
        status: action.payload,
      };

    case Type.setTitle:
      return {
        ...state,
        title: action.payload,
      };

    case Type.setEditingId:
      return {
        ...state,
        editingId: action.payload,
      };

    case Type.setDeletedTodos:
      return {
        ...state,
        deletedTodos: [...state.deletedTodos, action.payload],
      };

    case Type.resetDeletedTodos:
      return {
        ...state,
        deletedTodos: [
          ...state.deletedTodos.filter(todo => todo.id != action.payload.id),
        ],
      };

    case Type.setLoading:
      return {
        ...state,
        loading: action.payload,
      };

    case Type.setErrorMessage:
      return {
        ...state,
        errorMessage: action.payload,
      };

    case Type.setIsSubmitting:
      return {
        ...state,
        isSubmitting: action.payload,
      };

    case Type.setTempTodo:
      return {
        ...state,
        tempTodo: action.payload,
      };

    default:
      return state;
  }
}

type Props = {
  children: React.ReactNode;
};

export const StateContext = React.createContext<State>(initialState);
export const DispatchContext = React.createContext<React.Dispatch<Action>>(
  () => {},
);

export const GlobalStateProvider: React.FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>{children}</StateContext.Provider>
    </DispatchContext.Provider>
  );
};

export const useDispatch = () => React.useContext(DispatchContext);
export const useGlobalState = () => React.useContext(StateContext);
