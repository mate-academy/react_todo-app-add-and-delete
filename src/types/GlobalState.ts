import { Todo } from './Todo';

export type GlobalState = {
  userId: number,
  todos: Todo[],
  tempTodo: Todo | null,
  errors: {
    titleError: boolean,
    loadError: boolean,
    createError: boolean
    deleteError: boolean
    updateError: boolean
  }
};
