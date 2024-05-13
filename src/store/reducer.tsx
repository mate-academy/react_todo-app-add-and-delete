import React, { useContext, useReducer } from 'react';

// TYPES
import { FilterField } from '../types/FilterField';
import { State, Action, ActionType } from '../types/ReducerTypes';
import { Todo } from '../types/Todo';
import { TodoMethods } from '../types/TodoMethods';

interface Props {
  children: React.ReactNode;
}

const initialState: State = {
  todos: [],
  filterField: FilterField.All,
  errorMessage: '',
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case ActionType.SetTodos:
      return {
        ...state,
        todos: action.payload,
      };

    case ActionType.AddTodo:
      return {
        ...state,
        todos: [...state.todos, action.payload],
      };

    case ActionType.DeleteTodo:
      const newTodosArray = state.todos.filter(
        todo => todo.id !== action.payload,
      );

      return {
        ...state,
        todos: newTodosArray,
      };

    case ActionType.SetFilterField:
      return {
        ...state,
        filterField: action.payload,
      };

    case ActionType.SetErrorMessage:
      return {
        ...state,
        errorMessage: action.payload,
      };

    case ActionType.ClearErrorMessage:
      return {
        ...state,
        errorMessage: '',
      };
    default:
      return state;
  }
}

const StateContext = React.createContext(initialState);
// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
const DispatchContext = React.createContext((_value: any) => {});

// this hook returns current state of todos array, filter and error message
export const useCurrentState = () => {
  const todos = useContext(StateContext).todos;
  const filterField = useContext(StateContext).filterField;
  const errorMessage = useContext(StateContext).errorMessage;

  return {
    todos,
    filterField,
    errorMessage,
  };
};

// hook that returns object with method for more convenient usage
// this methods are responsible ONLY for local todos array
//
// with such approach you can write, for example:
// "deleteTodoLocal(someId)
//
// instead of
// "dispatch({ type: ActionType.DeleteTodo, payload: someId })"
export const useTodosMethods = (): TodoMethods => {
  const dispatch = useContext(DispatchContext);

  const setTodosLocal = (todos: Todo[]) => {
    dispatch({ type: ActionType.SetTodos, payload: todos });
  };

  const addTodoLocal = (todo: Todo) => {
    dispatch({ type: ActionType.AddTodo, payload: todo });
  };

  const deleteTodoLocal = (todoId: number) => {
    dispatch({ type: ActionType.DeleteTodo, payload: todoId });
  };

  const setFilterField = (filterField: FilterField) => {
    dispatch({ type: ActionType.SetFilterField, payload: filterField });
  };

  const setTimeoutErrorMessage = (message: string, delay = 3000) => {
    dispatch({
      type: ActionType.SetErrorMessage,
      payload: message,
    });

    setTimeout(() => {
      dispatch({
        type: ActionType.ClearErrorMessage,
      });
    }, delay);
  };

  return {
    setTodosLocal,
    addTodoLocal,
    deleteTodoLocal,
    setFilterField,
    setTimeoutErrorMessage,
  };
};

export const GlobalStateProvider: React.FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>{children}</StateContext.Provider>
    </DispatchContext.Provider>
  );
};
