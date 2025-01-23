import React, { useEffect, useState } from 'react';
import { Todo } from '../../types/Todo';
import { ErrorType } from '../../types/ErrorType';
import { USER_ID } from '../../api/todos';

type Props = {
  inputRef: React.RefObject<HTMLInputElement>;
  isLoading: boolean;
  setErrorMessage: (value: ErrorType) => void;
  onSubmit: (value: Todo) => Promise<void>;
};

export const Header: React.FC<Props> = ({
  inputRef,
  isLoading,
  setErrorMessage,
  onSubmit,
}) => {
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (!isLoading) {
      inputRef.current?.focus();
    }
  }, [inputRef, isLoading]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      setErrorMessage(ErrorType.ERROR_TITLE);

      return;
    }

    onSubmit({
      id: 0,
      title: title.trim(),
      userId: USER_ID,
      completed: false,
    }).then(() => setTitle(''));
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={event => setTitle(event.target.value)}
          ref={inputRef}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
