/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { FormEvent, useEffect, useRef } from 'react';
import classNames from 'classnames';

type Props = {
  title: string;
  hasTodos: boolean;
  hasActiveTodos: boolean;
  isAdding: boolean;
  onSubmit: (e: FormEvent) => void;
  setTitle: (title: string) => void;
};

export const Header: React.FC<Props> = React.memo(({
  title,
  hasTodos,
  hasActiveTodos,
  isAdding,
  onSubmit,
  setTitle,
}) => {
  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (newTodoField.current && hasTodos) {
      newTodoField.current.focus();
    }
  }, [isAdding]);

  return (
    <header className="todoapp__header">
      {hasTodos && (
        <button
          data-cy="ToggleAllButton"
          type="button"
          className={classNames(
            'todoapp__toggle-all',
            {
              active: !hasActiveTodos,
            },
          )}
        />
      )}

      <form onSubmit={onSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={(e => setTitle(e.target.value))}
          disabled={isAdding}
        />
      </form>
    </header>
  );
});
