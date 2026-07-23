/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { ErrorMessage } from '../types/ErrorMessage';

type Props = {
  focusRef?: React.RefObject<HTMLInputElement>;
  isAllCompleted: boolean;
  hasTodos: boolean;
  onAddTodo: (title: string) => Promise<void>;
  onToggleAll: () => void;
  isSubmitting: boolean;
  onError: (msg: string) => void;
};

export const Header: React.FC<Props> = ({
  focusRef,
  isAllCompleted,
  hasTodos,
  onAddTodo,
  onToggleAll,
  isSubmitting,
  onError,
}) => {
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (!isSubmitting) {
      focusRef?.current?.focus();
    }
  }, [isSubmitting, focusRef]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      onError(ErrorMessage.Title);

      return;
    }

    onAddTodo(trimmedTitle)
      .then(() => {
        setTitle('');
      })
      .catch(() => {});
  };

  return (
    <header className="todoapp__header">
      {hasTodos && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: isAllCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={onToggleAll}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          ref={focusRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={e => setTitle(e.target.value)}
          disabled={isSubmitting}
        />
      </form>
    </header>
  );
};
