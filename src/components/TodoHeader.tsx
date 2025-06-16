import { RefObject, useEffect, useState } from 'react';
import { ErrorMessage } from '../types/ErrorMessage';
import { createTodos, USER_ID } from '../api/todos';
import { Todo } from '../types/Todo';

type TodoHeaderProps = {
  setErrorMessage: (val: ErrorMessage) => void;
  setTempTodo: (val: Todo | null) => void;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  isVisibleFooter: boolean;
  inputRef: RefObject<HTMLInputElement>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

export const TodoHeader = ({
  setErrorMessage,
  setTempTodo,
  setTodos,
  isVisibleFooter,
  inputRef,
  isLoading,
  setIsLoading,
}: TodoHeaderProps) => {
  const [query, setQuery] = useState('');

  const handleQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      setErrorMessage(ErrorMessage.WithoutError);

      setTimeout(() => {
        setErrorMessage(ErrorMessage.EmptyTitle);
      }, 0);

      return;
    }

    const newTodo = {
      userId: USER_ID,
      title: trimmedQuery,
      completed: false,
    };

    setTempTodo({ ...newTodo, id: 0 });
    setIsLoading(true);
    createTodos(newTodo)
      .then(newTodoFromServer => {
        setTodos(currentTodo => {
          return [...currentTodo, newTodoFromServer];
        });
        setTempTodo(null);
        setQuery('');
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.UnableAddTodo);
        setTempTodo(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef, isLoading]);

  return (
    <header className="todoapp__header">
      {isVisibleFooter && (
        <button
          type="button"
          className="todoapp__toggle-all"
          data-cy="ToggleAllButton"
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo active"
          placeholder="What needs to be done?"
          value={query}
          onChange={handleQuery}
          autoFocus
          ref={inputRef}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
