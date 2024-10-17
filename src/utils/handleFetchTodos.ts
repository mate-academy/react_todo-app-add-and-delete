import { Todo } from '../types/Todo';
import { Errors } from '../types/Errors';

import { getTodos } from '../api/todos';
import { handleError } from './handleError';

export const handleFetchTodos = async (
  setTodos: (todos: Todo[]) => void,
  setError: (error: Errors) => void,
) => {
  try {
    const todos = await getTodos();

    setTodos(todos);
  } catch {
    handleError(Errors.LOAD_ERROR, setError);
  }
};
