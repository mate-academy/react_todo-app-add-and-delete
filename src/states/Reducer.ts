import { Todo } from '../types/Todo';
import { GlobalState } from '../types/GlobalState';
import { ErrorType } from '../types/ErrorType';

export enum ActionType {
  CreateTodo,
  SetTodos,
  UpdateTodo,
  DeleteTodo,
  SetTempTodo,
  ToggleError,
  ResetErrors,
}

export type Action = { type: ActionType.CreateTodo, payload: { todo: Todo } }
| { type: ActionType.SetTodos, payload: { todos: Todo[] } }
| {
  type: ActionType.UpdateTodo,
  payload: { id: number, content?: string, completed?: boolean }
}
| { type: ActionType.DeleteTodo, payload: { id: number } }
| { type: ActionType.SetTempTodo, payload: { tempTodo: Todo | null } }
| { type: ActionType.ToggleError, payload: { errorType: ErrorType | null } }
| { type: ActionType.ResetErrors, payload: { } };

export const reducer = (
  state: GlobalState,
  { type, payload }: Action,
): GlobalState => {
  switch (type) {
    case ActionType.CreateTodo:
      return {
        ...state,
        todos: [...state.todos, payload.todo],
      };

    case ActionType.SetTodos:
      return {
        ...state,
        todos: payload.todos,
      };

    case ActionType.UpdateTodo: {
      const todoToUpdate = state.todos.find(
        todo => todo.id === payload.id,
      );

      if (todoToUpdate && payload.content) {
        todoToUpdate.title = payload.content;
      }

      if (todoToUpdate && payload.completed) {
        todoToUpdate.completed = payload.completed;
      }

      return {
        ...state,
        todos: state.todos.map(todo => {
          if (todo.id === todoToUpdate?.id) {
            return todoToUpdate;
          }

          return todo;
        }),
      };
    }

    case ActionType.DeleteTodo:
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== payload.id),
      };

    case ActionType.SetTempTodo:
      return {
        ...state,
        tempTodo: payload.tempTodo,
      };

    case ActionType.ToggleError:
      return {
        ...state,
        error: payload.errorType,
      };

    default:
      return state;
  }
};
