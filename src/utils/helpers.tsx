import { createTodos, deleteTodos } from '../api/todos';
import { Todo } from '../types/Todo';
import { errorMessages } from './const';
import { client } from './fetchClient';

export enum Status {
  all = 'All',
  active = 'active',
  completed = 'completed',
}

export const filter = (todos: Todo[], selectedFilter: Status): Todo[] => {
  switch (selectedFilter) {
    case Status.all:
      return todos;

    case Status.active:
      return todos.filter(todo => !todo.completed);

    case Status.completed:
      return todos.filter(todo => todo.completed);

    default:
      return todos;
  }
};

export const deleteTodo = (
  todoId: number,
  setTodos: (update: (todos: Todo[]) => Todo[]) => void,
  setIsLoadingWhileDelete: (isLoading: boolean) => void,
  setHasError: (value: boolean) => void,
  setErrorMessage: (message: string) => void,
  onSuccess?: () => void,
) => {
  setIsLoadingWhileDelete(true);

  deleteTodos(todoId)
    .then(() => {
      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
      if (onSuccess) {
        onSuccess();
      }
    })
    .catch(() => {
      if (setErrorMessage) {
        setHasError(true);
        setErrorMessage(errorMessages.deleteError);
      }
    })
    .finally(() => setIsLoadingWhileDelete(false));
};

export const addTodo = (
  { title, userId, completed }: Omit<Todo, 'id'>,
  setTodos: (update: (todos: Todo[]) => Todo[]) => void,
  setIsLoading: (isLoading: boolean) => void,
  setTempTodo: (todo: Todo | null) => void,
  setTitle: (title: string) => void,
  setHasError: (value: boolean) => void,
  setErrorMessage?: (message: string) => void,
) => {
  createTodos({ title, userId, completed })
    .then(newTodo => {
      setTodos(currentTodos => [...currentTodos, newTodo]);
      setTitle('');
    })
    .catch(() => {
      if (setErrorMessage) {
        setErrorMessage(errorMessages.addingError);
        setHasError(true);
      }
    })
    .finally(() => {
      setIsLoading(false);
      setTempTodo(null);
    });
};

export const updateTodoCompleated = (todoId: number, completed: boolean) => {
  return client.patch<Todo>(`/todos/${todoId}`, {
    completed: completed,
  });
};
