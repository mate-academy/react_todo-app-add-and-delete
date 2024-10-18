import { deleteTodo } from '../api/todos';
import { Errors } from './Errors';
import { Todo } from '../types/Todo';
import { handleError } from './handleError';

export const deletingTodo = (
  IdsArray: number[],
  setError: (error: Errors) => void,
  setTodos: (todos: (prevState: Todo[]) => Todo[]) => void,
): Promise<PromiseSettledResult<void>[]> => {
  return Promise.allSettled(
    IdsArray.map(async id => {
      try {
        await deleteTodo(id);
        setTodos((prevState: Todo[]) =>
          prevState.filter(todo => todo.id !== id),
        );
      } catch {
        handleError(Errors.DeleteTodo, setError);
      }
    }),
  );
};
