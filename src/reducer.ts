/* eslint-disable max-len */
import { Todo } from './types/Todo';

type ActionMap<M extends { [index: string]: unknown }> = {
  [Key in keyof M]: M[Key] extends undefined
    ? {
      type: Key;
    }
    : {
      type: Key;
      payload: M[Key];
    }
};

export enum Types {
  SetErrorMessage = 'SET_ERROR_MESSAGE',
  SetTodosToState = 'SET_TODOS_TO_STATE',
  SetUpdatedTodoId = 'SET_UPDATED_TODO_ID',
  RemoveUpdatedTodoId = 'REMOVE_UPDATED_TODO_ID',
  Create = 'CREATE_TODO',
  Delete = 'DELETE_TODO',
  ToggleCompleted = 'TOGGLE_COMPLETED',
  ClearCompleted = 'CLEAR_COMPLETED',
  FilterCompleted = 'FILTER_COMPLETED',
  FilterActive = 'FILTER_ACTIVE',
  FilterAll = 'FILTER_ALL',
  ToggleSelectAll = 'TOGGLE_SELECT_ALL',
  Edit = 'EDIT_TODO',
}

type TodoPayload = {
  [Types.Create] : {
    id: number;
    userId: number;
    title: string;
    completed: boolean;
  };
  [Types.Delete]: {
    id: number;
  };
  [Types.ToggleCompleted]: {
    id: number;
  };
  [Types.ClearCompleted]: {};
  [Types.SetTodosToState]: {
    todos: Todo[] | [];
  };
  [Types.ToggleSelectAll]: {
    isSelectedAll: boolean;
  };
  [Types.Edit]: {
    todoToEdit: Todo;
    id?: number;
  };
};

export type TodoActions = ActionMap<TodoPayload>[keyof ActionMap<TodoPayload>];

export const todoReducer = (todos: Todo[], action: TodoActions) => {
  switch (action.type) {
    case Types.Create:
      return [
        ...todos,
        {
          id: action.payload.id,
          userId: action.payload.userId,
          title: action.payload.title,
          completed: action.payload.completed,
        },
      ];
    case Types.Delete:
      return [
        ...todos.filter(todo => todo.id !== action.payload.id),
      ];
    case Types.SetTodosToState: {
      return [...action.payload.todos];
    }

    case Types.Edit: {
      const index = todos.findIndex(todo => {
        if (action.payload?.id !== undefined) {
          return action.payload.id === todo.id;
        }

        return action.payload.todoToEdit.id === todo.id;
      });
      const result = [...todos];

      result.splice(index, 1, action.payload.todoToEdit);

      return result;
    }

    case Types.ToggleCompleted:
      return [
        ...todos.map(todo => {
          if (todo.id === action.payload.id) {
            return { ...todo, completed: !todo.completed };
          }

          return todo;
        }),
      ];
    case Types.ClearCompleted:
      return [
        ...todos.filter(todo => todo.completed === false),
      ];
    case Types.ToggleSelectAll:
      if (action.payload.isSelectedAll) {
        return [
          ...todos.map(todo => {
            return { ...todo, completed: false };
          }),
        ];
      }

      return [
        ...todos.map(todo => {
          return { ...todo, completed: true };
        }),
      ];
    default:
      return todos;
  }
};

type FilterPayload = {
  [Types.FilterCompleted]: undefined;
  [Types.FilterActive]: undefined;
  [Types.FilterAll]: undefined;
};

// eslint-disable-next-line max-len
export type FiltertActions = ActionMap<FilterPayload>[keyof ActionMap<FilterPayload>];

export const filterReducer = (filter: string, action: FiltertActions) => {
  switch (action.type) {
    case Types.FilterCompleted:
      return 'completed';
    case Types.FilterActive:
      return 'active';
    case Types.FilterAll:
      return 'all';
    default:
      return filter;
  }
};

type IsUpdatedPayload = {
  [Types.SetUpdatedTodoId]: {
    updatedTodoId: number;
  };
  [Types.RemoveUpdatedTodoId]: {
    updatedTodoId: number;
  };
};

// eslint-disable-next-line max-len
export type UpdatedTodoIdActions = ActionMap<IsUpdatedPayload>[keyof ActionMap<IsUpdatedPayload>];

export const updatedTodoIdReducer = (updatedTodoIds: number[], action: UpdatedTodoIdActions) => {
  switch (action.type) {
    case Types.SetUpdatedTodoId:
      return [...updatedTodoIds, action.payload.updatedTodoId];
    case Types.RemoveUpdatedTodoId:
      return [...updatedTodoIds.filter(id => id !== action.payload.updatedTodoId)];
    default:
      return updatedTodoIds;
  }
};

type ErrorPayload = {
  [Types.SetErrorMessage]: {
    errorMessage: string;
  };
};

// eslint-disable-next-line max-len
export type ErrorMessageActions = ActionMap<ErrorPayload>[keyof ActionMap<ErrorPayload>];

export const errorMessageReducer = (errorMessage: string, action: ErrorMessageActions) => {
  switch (action.type) {
    case Types.SetErrorMessage:
      return action.payload.errorMessage;
    default:
      return errorMessage;
  }
};
