/* eslint-disable */
import { FC, ReactNode, createContext, useReducer } from 'react';
import { Action, Actions } from '../types/actions';
import { Filter, State } from '../types/state';

const reducer = (state: State, action: Actions) => {
  switch (action.type) {
    case Action.addTodo: {
      return {
        ...state,
        todos: [...state.todos, action.payload],
      };
    }

    case Action.updateTodo: {
      const newTodos = [...state.todos];

      const index = newTodos.findIndex(todo => todo.id === action.payload.id);

      newTodos.splice(index, 1, action.payload);

      return { ...state, todos: newTodos };
    }

    case Action.deleteTodo: {
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload),
      };
    }

    case Action.changeFiilter: {
      return {
        ...state,
        filter: action.payload,
      };
    }

    default: {
      return state;
    }
  }
};

const inititalState: State = {
  filter: Filter.all,
  todos: [],
};

export const StateContext = createContext(inititalState);
export const DispatchContext = createContext((_action: Actions) => {});

type Props = {
  children: ReactNode;
};

export const GlobalStateProvider: FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, inititalState);

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>{children}</StateContext.Provider>
    </DispatchContext.Provider>
  );
};
