import { useEffect, useState } from 'react';
import { deleteTodo, getTodos, postTodo } from '../../api/todos';
import { Todo } from '../../types/Todo';
import { FilterOptionType } from '../../types/FilterOptionType';
import { ErrorMessages } from '../../types/ErrorMessages';

export const useTodo = () => {
  const [errorMessage, setErrorMessage] = useState<ErrorMessages>(
    ErrorMessages.None,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterOption, setFilterOption] = useState<FilterOptionType>('all');
  const [isTodoLoading, setIsTodoLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo>();
  const [deletingTodoId, setDeletingTodoId] = useState<number | null>(null);
  const [focusInput, setFocusInput] = useState(0);

  const filteredTodos = [...todos].filter(todo => {
    switch (filterOption) {
      case 'active':
        return !todo.completed;
      case 'completed':
        return todo.completed;
      default:
        return true;
    }
  });

  function setError(error: ErrorMessages) {
    setErrorMessage(error);
    setTimeout(() => {
      setErrorMessage(ErrorMessages.None);
    }, 3000);
  }

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setError(ErrorMessages.CantLoad))
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleCreateTodo = (
    { title, completed, userId }: Todo,
    setQuery: React.Dispatch<React.SetStateAction<string>>,
  ) => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError(ErrorMessages.TitleIsEmpty);
      return;
    }

    setTempTodo({ title: trimmedTitle, completed, userId, id: 0 });
    setIsTodoLoading(true);

    postTodo({ title: trimmedTitle, completed, userId })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setQuery('');
      })
      .catch(() => {
        setError(ErrorMessages.UnableToAdd);
        setQuery(trimmedTitle);
      })
      .finally(() => {
        setIsTodoLoading(false);
        setIsLoading(false);
      });
  };

  const handleDeleteTodo = (todoId: number) => {
    setDeletingTodoId(todoId);

    deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        setError(ErrorMessages.UnableToDelete);
      })
      .finally(() => {
        setDeletingTodoId(null);
        setFocusInput(prev => prev + 1);
      });
  };

  const handleClearCompletedTodos = () => {
    todos
      .filter(todo => todo.completed)
      .map(todo =>
        deleteTodo(todo.id)
          .then(() => {
            setTodos(current =>
              current.filter(currentTodo => currentTodo.id !== todo.id),
            );
          })
          .catch(() => {
            setError(ErrorMessages.UnableToDelete);
          }),
      );
  };

  return {
    errorMessage,
    setErrorMessage,
    isLoading,
    todos,
    filteredTodos,
    filterOption,
    setFilterOption,
    handleCreateTodo,
    handleDeleteTodo,
    isTodoLoading,
    tempTodo,
    deletingTodoId,
    handleClearCompletedTodos,
    focusInput,
    setFocusInput
  };
};
