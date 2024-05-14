import { getTodosFromAPI } from '../api/todos';
import { Todo } from '../types/Todo';

export function getTodos(): Promise<Todo[]> {
  return getTodosFromAPI().then(response => response);
}

export default { getTodos };
