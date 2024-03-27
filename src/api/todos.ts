import { Status, Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 292;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const getVisibleTodos = (todos: Todo[], status: string) => {
  switch (status) {
    case Status.Active:
      return todos.filter(todo => !todo.completed);
    case Status.Completed:
      return todos.filter(todo => todo.completed);
    default:
      return todos;
  }
};

export const getCount = (todos: Todo[]): number => {
  if (todos) {
    return todos.filter(todo => !todo.completed).length;
  }

  return 0;
};

export const addTodo = (postId: number, postTitle: string) => {
  return client.post<Todo>(`/todos`, {
    id: postId,
    userId: 292,
    title: postTitle,
    completed: false,
  });
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const handleDeleteTodo = (
  todo: Todo,
  todoId: number,
  setIsLoading: (e: number | null) => void,
  setErrorMessage: (m: string) => void,
) => {
  setIsLoading(todoId);

  deleteTodo(todo.id)
    .catch(() => {
      setErrorMessage(`Unable to delete a todo`);
    })
    .finally(() => setIsLoading(null));
};

export const getNewTodoId = (todos: Todo[] | null) => {
  if (todos !== null) {
    const maxId = Math.max(...todos.map(todo => todo.id));

    return maxId + 1;
  }

  return 1;
};
