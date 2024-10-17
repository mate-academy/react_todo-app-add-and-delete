import { useCallback, useMemo, useState } from 'react';
import { ErrorMessages, StatusFilter, Todo } from '../types';
import { addTodo, deleteTodo, getTodos, USER_ID } from '../api/todos';
import { useTodoForm } from './useTodoForm';
import { countLeftTodos, getCompletedTodoIds } from '../utils';

export const useTodo = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [errorMessage, setErrorMessage] = useState<ErrorMessages>(
    ErrorMessages.DEFAULT,
  );
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(
    StatusFilter.All,
  );

  const {
    newTodoTitle,
    setNewTodoTitle,
    isLoadingSubmit,
    setIsLoadingSubmit,
    isFocusedInput,
    setIsFocusedInput,
  } = useTodoForm();

  const todosAmount = todos.length;
  const activeTodosAmount = useMemo(() => countLeftTodos(todos), [todos]);
  const completedTodoIds = useMemo(() => getCompletedTodoIds(todos), [todos]);

  const handleResetErrorMessage = useCallback(
    () => setErrorMessage(ErrorMessages.DEFAULT),
    [],
  );

  const handleError = (message: ErrorMessages) => {
    setErrorMessage(message);
    setTimeout(handleResetErrorMessage, 3000);
  };

  const handleLoadTodos = () => {
    getTodos()
      .then(currentTodos => {
        setTodos(currentTodos);
      })
      .catch(() => handleError(ErrorMessages.LOADING_TODOS));
  };

  const handleDeleteTodo = (todoId: Todo['id']) => {
    setLoadingTodoIds(ids => [...ids, todoId]);

    deleteTodo(todoId)
      .then(() =>
        setTodos(currentTodos =>
          currentTodos.filter(curTodo => curTodo.id !== todoId),
        ),
      )
      .catch(() => handleError(ErrorMessages.DELETING_TODO))
      .finally(() =>
        setLoadingTodoIds(ids => ids.filter(currentId => currentId !== todoId)),
      );
  };

  const handleClearCompleted = () => {
    completedTodoIds.forEach(id => handleDeleteTodo(id));
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setNewTodoTitle(event.target.value);

  const handleSubmitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = newTodoTitle.trim();

    if (!trimmedTitle.length) {
      handleError(ErrorMessages.EMPTY_TITLE);

      return;
    }

    const newTodo: Omit<Todo, 'id'> = {
      title: trimmedTitle,
      completed: false,
      userId: USER_ID,
    };

    setIsLoadingSubmit(true);
    setTempTodo({ ...newTodo, id: 0 });
    setIsFocusedInput(false);

    addTodo(newTodo)
      .then(todo => {
        setTodos(currentTodos => [...currentTodos, todo]);
        setNewTodoTitle('');
      })
      .catch(() => handleError(ErrorMessages.ADDING_TODO))
      .finally(() => {
        setIsLoadingSubmit(false);
        setTempTodo(null);
        setIsFocusedInput(true);
      });
  };

  return {
    todos,
    setTodos,
    todosAmount,
    loadingTodoIds,
    tempTodo,
    setTempTodo,
    activeTodosAmount,
    errorMessage,
    statusFilter,
    setStatusFilter,
    handleResetErrorMessage,
    handleError,
    handleLoadTodos,
    handleDeleteTodo,
    handleClearCompleted,
    newTodoTitle,
    isFocusedInput,
    isLoadingSubmit,
    handleTitleChange,
    handleSubmitForm,
  };
};
