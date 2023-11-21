/* eslint-disable max-len */
import { Todo } from '../types/Todo';

export enum ReducerActionType {
  LOAD__TODO,
  ADD__TODO,
  DELETE__TODO,
  UPDATE__TODO,
  ISCHECHED__TODO,
  CLEAR__COMPLETED,
}

interface ReducerAction {
  type: ReducerActionType,
  payload?: any,
}

export const actions = {
  load: (payload: Todo[]) => ({ type: ReducerActionType.LOAD__TODO, payload }),
  add: (payload: Todo) => ({ type: ReducerActionType.ADD__TODO, payload }),
  delete: (payload: number) => ({ type: ReducerActionType.DELETE__TODO, payload }),
  update: (payload: Todo) => ({ type: ReducerActionType.UPDATE__TODO, payload }),
  isCheckedTodo: (payload: number) => ({ type: ReducerActionType.ISCHECHED__TODO, payload }),
  clearCompleted: () => ({ type: ReducerActionType.CLEAR__COMPLETED }),
};

export const reducer = (state: Todo[], action: ReducerAction): any => {
  switch (action.type) {
    case ReducerActionType.LOAD__TODO: {
      const { payload: loadTodo } = action;

      return loadTodo;
    }

    case ReducerActionType.ADD__TODO: {
      const { payload: newTodo } = action;

      return [...state, newTodo];
    }

    case ReducerActionType.DELETE__TODO: {
      const { payload: todoId } = action;

      return state.filter((todo: Todo) => todo.id !== todoId);
    }

    case ReducerActionType.ISCHECHED__TODO: {
      const { payload: todoId } = action;

      return state.map((todo) => {
        if (todo.id === todoId) {
          return {
            ...todo,
            completed: !todo.completed,
          };
        }

        return todo;
      });
    }

    case ReducerActionType.CLEAR__COMPLETED: {
      return state.filter((todo) => !todo.completed);
    }

    case ReducerActionType.UPDATE__TODO: {
      return [];
    }

    default: return state;
  }
};
