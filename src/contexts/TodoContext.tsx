import React, { useReducer } from 'react';
import { Todo } from '../types/Todo';

export interface TodoState {
  todos: Todo[];
  dispatch: React.Dispatch<Actions>;
}

export const TodoContext = React.createContext<TodoState>({
  todos: [],
  dispatch: () => {},
});

export enum ActionType {
  GET = 'GET',
  ADD = 'ADD',
  DELETE = 'DELETE',
  SET = 'SET',
}

export type GetAction = {
  type: ActionType.GET;
};

export type SetAction = {
  type: ActionType.SET;
  payload: Todo[];
};

export type AddAction = {
  type: ActionType.ADD;
  payload: Todo;
};

export type DeleteAction = {
  type: ActionType.DELETE;
  payload: number;
};

export type Actions = GetAction | AddAction | DeleteAction | SetAction;

const reducer = (state: Todo[], action: Actions): Todo[] => {
  switch (action.type) {
    case ActionType.GET: {
      return state;
    }

    case ActionType.ADD: {
      return [...state, action.payload];
    }

    case ActionType.DELETE: {
      return [...state.filter(x => x.id !== action.payload)];
    }

    case ActionType.SET: {
      return [...action.payload];
    }

    default: {
      return state;
    }
  }
};

export const TodoContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [todos, dispatch] = useReducer(reducer, []);

  return (
    <TodoContext.Provider
      value={{
        todos: todos,
        dispatch: dispatch,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};
