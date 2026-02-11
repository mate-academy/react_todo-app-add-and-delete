import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { ERRORS } from '../../types/Todo';

interface Props {
  allCompleted: boolean;
  loading: boolean;
  addTodo: (title: string) => Promise<void>;
  onError: (error: string) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  hasTodos: boolean;
}

export const Header: React.FC<Props> = ({
  allCompleted,
  loading,
  addTodo,
  onError,
  inputRef,
  hasTodos,
}) => {
  const [title, setTitle] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const normalizedTitle = title.trim();

    if (normalizedTitle.length === 0) {
      onError(ERRORS.EMPTY_TITLE);

      return;
    }

    addTodo(normalizedTitle.trim())
      .then(() => setTitle(''))
      .catch(() => {});
  };

  useEffect(() => {
    if (!loading) {
      inputRef.current?.focus();
    }
  }, [loading, inputRef]);

  return (
    <header className="todoapp__header">
      {hasTodos && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: allCompleted,
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
          onChange={event => setTitle(event.target.value)}
          disabled={loading}
          autoFocus
          ref={inputRef}
        />
      </form>
    </header>
  );
};
