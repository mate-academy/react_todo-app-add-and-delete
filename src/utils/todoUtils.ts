import * as todoService from '../api/todos';
import { Todo } from '../types/Todo';

type TodoHelpers = {
  todos: Todo[];
  setErrorMessage: (msg: string) => void;
  setIsSubmitting: (status: boolean) => void;
  setTempTodo: (todo: Todo | null) => void;
  setLoadingTodoId: (id: number | number[] | null) => void;
  setTodos: (cb: (todos: Todo[]) => Todo[]) => void;
  closeError: () => void;
  timerId: { current: number };
  inputRef: React.RefObject<HTMLInputElement>;
};

export const addTodo = (
  helpers: TodoHelpers,
  { title, userId, completed }: Omit<Todo, 'id'>,
): Promise<void> => {
  const {
    setErrorMessage,
    setIsSubmitting,
    setTempTodo,
    setLoadingTodoId,
    setTodos,
    closeError,
    timerId,
  } = helpers;

  setErrorMessage('');
  setIsSubmitting(true);
  setTempTodo({ id: 0, title, userId, completed });
  setLoadingTodoId(0);

  return todoService
    .createTodo({ title, userId, completed })
    .then(newTodo => {
      setTodos(currentTodos => [...currentTodos, newTodo]);
      setLoadingTodoId(null);
      setTempTodo(null);
      setErrorMessage('');
    })
    .catch(error => {
      setTempTodo(null);
      setLoadingTodoId(null);
      setErrorMessage('Unable to add a todo');
      window.clearTimeout(timerId.current);
      closeError();
      throw error;
    })
    .finally(() => setIsSubmitting(false));
};

export const deleteTodo = (todoId: number, helpers: TodoHelpers) => {
  const {
    setErrorMessage,
    setLoadingTodoId,
    setTodos,
    closeError,
    timerId,
    inputRef,
    todos,
  } = helpers;

  setErrorMessage('');
  setLoadingTodoId(todoId);
  const previousTodos = [...todos];

  todoService
    .deleteTodo(todoId)
    .then(() => {
      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));

      if (inputRef.current !== null) {
        inputRef.current.focus();
      }

      setErrorMessage('');
    })
    .catch(error => {
      setTodos(() => previousTodos);
      setErrorMessage('Unable to delete a todo');
      setLoadingTodoId(null);
      window.clearTimeout(timerId.current);
      closeError();
      throw error;
    })
    .finally(() => setLoadingTodoId(null));
};

export const updateTodo = (selectedTodo: Todo, helpers: TodoHelpers) => {
  const {
    setErrorMessage,
    setLoadingTodoId,
    setTodos,
    timerId,
    closeError,
    todos,
  } = helpers;

  setErrorMessage('');
  setLoadingTodoId(selectedTodo.id);
  todoService
    .updateTodo(selectedTodo)
    .then(() => {
      setTodos(() => {
        const newTodos = todos.map(todo =>
          todo.id === selectedTodo.id ? selectedTodo : todo,
        );

        return newTodos;
      });
      setErrorMessage('');
    })
    .catch(error => {
      setErrorMessage('Unable to update a todo');
      window.clearTimeout(timerId.current);
      closeError();
      throw error;
    })
    .finally(() => setLoadingTodoId(null));
};

export const clearCompleted = (helpers: TodoHelpers) => {
  const {
    setErrorMessage,
    setLoadingTodoId,
    setTodos,
    closeError,
    inputRef,
    todos,
    timerId,
  } = helpers;

  setErrorMessage('');
  const completedTodos = todos.filter(todo => todo.completed);

  if (completedTodos.length === 0) {
    return;
  }

  setLoadingTodoId(completedTodos.map(todo => todo.id));

  Promise.allSettled(
    completedTodos.map(todo => todoService.deleteTodo(todo.id)),
  )
    .then(results => {
      const failedTodos = completedTodos.filter(
        (_, index) => results[index].status === 'rejected',
      );

      setTodos(currentTodos =>
        currentTodos.filter(
          todo =>
            !todo.completed ||
            failedTodos.some(failed => failed.id === todo.id),
        ),
      );

      if (inputRef.current !== null) {
        inputRef.current.focus();
      }

      if (failedTodos.length > 0) {
        setErrorMessage('Unable to delete a todo');
        window.clearTimeout(timerId.current);
        closeError();
      }
    })
    .finally(() => {
      setLoadingTodoId(null);
    });
};

export const completeAllTodo = (helpers: TodoHelpers) => {
  const {
    setErrorMessage,
    setLoadingTodoId,
    setTodos,
    closeError,
    timerId,
    todos,
  } = helpers;

  setErrorMessage('');
  const hasNoCompletedTodos = todos.some(todo => !todo.completed);
  const newCompletionState = hasNoCompletedTodos ? true : false;
  const hasTodosId = todos.map(todo => todo.id);

  setLoadingTodoId(hasTodosId);

  Promise.all(
    todos.map(todo =>
      todoService.updateTodo({ ...todo, completed: newCompletionState }),
    ),
  )
    .then(todosComplete => {
      const newTodos = todosComplete.flat();

      setTodos(() => newTodos);
      setLoadingTodoId(null);
      setErrorMessage('');
    })
    .catch(error => {
      setErrorMessage('Unable to update a todo');
      window.clearTimeout(timerId.current);
      closeError();
      throw error;
    });
};
