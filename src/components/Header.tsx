import classNames from 'classnames';
import React, { FormEvent, useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';
import { ErrorMessages } from '../enum/ErrorMassages';

interface Props {
  onAdd: (newTodo: Todo) => void;
  showError: (message: ErrorMessages) => void;
  isLoading: boolean;
  todos: Todo[];
}

export const Header: React.FC<Props> = ({
  onAdd,
  showError,
  isLoading,
  todos,
}) => {
  const [title, setTitle] = useState<string>('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  const trimmedTitle = title.trim();

  const allCompletedTodos = todos.every(todo => todo.completed);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!trimmedTitle) {
      showError(ErrorMessages.Title);
      inputRef.current?.focus();

      return;
    }

    // eslint-disable-next-line no-console
    console.log('Calling onAdd with:', trimmedTitle);

    try {
      await onAdd({
        id: 0,
        userId: 1380,
        title: trimmedTitle,
        completed: false,
      });
      setTitle('');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('Error while adding todo:', error);
      showError(ErrorMessages.Add);
      inputRef.current?.focus();
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading]);

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: allCompletedTodos,
          })}
          data-cy="ToggleAllButton"
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          ref={inputRef}
          onChange={event => setTitle(event.target.value)}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
