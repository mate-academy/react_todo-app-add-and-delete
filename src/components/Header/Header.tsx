import React, { useEffect } from 'react';
import { Errors } from '../../types/Errors';

type Props = {
  onAddNewTodo: (_: string) => void;
  onError: (_: Errors) => void;
  isPosting: boolean;
  title: string;
  setTitle: (_: string) => void;
  inputRef: React.RefObject<HTMLInputElement>;
};

export const Header: React.FC<Props> = ({
  onAddNewTodo,
  onError,
  isPosting,
  title,
  setTitle,
  inputRef,
}) => {
  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleTitleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (trimmedTitle) {
      onAddNewTodo(trimmedTitle);
    } else {
      onError(Errors.Title);
    }
  };

  useEffect(() => {
    inputRef.current?.focus();
  });

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      <form onSubmit={handleTitleFormSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={handleTitleChange}
          disabled={isPosting}
        />
      </form>
    </header>
  );
};
