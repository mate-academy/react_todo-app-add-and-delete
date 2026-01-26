import React, { useEffect } from 'react';
import { ErrorType } from '../../types/ErrorType';
import { Todo } from '../../types/Todo';

type Props = {
  handleAddTodo: (title: string) => void;
  handleError: (errorAnswer: ErrorType | null) => void;
  error: ErrorType | null;
  tempTodo: Todo | null;
  title: string;
  onTitleChange: (value: string) => void;

  inputRef: React.RefObject<HTMLInputElement> | null;
};

export const Header: React.FC<Props> = ({
  handleAddTodo,
  handleError,
  // error,
  tempTodo,
  title,
  onTitleChange,

  inputRef,
}) => {
  useEffect(() => {
    if (!tempTodo && inputRef && inputRef.current) {
      inputRef.current.focus();
    }
  }, [tempTodo, inputRef]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (title.trim().length === 0) {
      handleError('Title should not be empty');

      return;
    }

    handleAddTodo(title.trim());
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          value={title}
          onChange={event => onTitleChange(event.target.value)}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={tempTodo !== null}
        />
      </form>
    </header>
  );
};
