import { getTodos } from '../api/todos';
import { Todo } from '../types/Todo';

export async function fetchTodosFromApi() {
  let todosFromApi: Todo[] = [];

  try {
    todosFromApi = await getTodos();

    setTodos(todosFromApi);
  } catch {
    setErrorMessage(Errors.loadError);
  }

  return todosFromApi;
}
