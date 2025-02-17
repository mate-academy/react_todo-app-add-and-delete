import React, { useEffect, useRef } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  onSubmit: (todo: Todo) => void;
  todos: Todo[];
  error: string;
  setError: (error: string) => void;
  setInputDisabled: () => void;
  inputDisabled: boolean;
  inputTitle: string;
  handleTitleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export const Header: React.FC<Props> = ({
  todos,
  onSubmit,
  setError,
  setInputDisabled,
  inputDisabled,
  inputTitle,
  handleTitleChange,
}) => {
  const titleField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!inputDisabled && titleField.current) {
      titleField.current.focus();
    }
  }, [inputDisabled, todos]);

  const handleOnSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setInputDisabled();

    onSubmit({
      id: 0,
      userId: 762,
      title: inputTitle,
      completed: false,
    });
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      {!!todos.length && (
        <button
          type="button"
          className="todoapp__toggle-all active"
          data-cy="ToggleAllButton"
        />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={handleOnSubmit}>
        <input
          ref={titleField}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={inputTitle}
          onChange={handleTitleChange}
          disabled={inputDisabled}
        />
      </form>
    </header>
  );
};
