import { getTodos } from '../api/todos';
import { handleError } from './handleError';
import { Errors } from './Errors';
import { Todo } from '../types/Todo';

export const handleGetTodos = (
  setTodos: ((value: Todo[]) => void) | null | undefined,
  setErrorMessage: (error: Errors) => void,
) => {
  getTodos()
    .then(setTodos)
    .catch(() => {
      handleError(Errors.Loading, setErrorMessage);
    });
};
