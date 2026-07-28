import React, { useEffect } from 'react';
import classNames from 'classnames';

interface Props {
  isEveryCompleted: boolean;
  title: string;
  setTitle: (title: string) => void;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
  inputRef: React.RefObject<HTMLInputElement>;
}

export const Header: React.FC<Props> = ({
  isEveryCompleted,
  title,
  setTitle,
  isSubmitting,
  onSubmit,
  inputRef,
}) => {
  useEffect(() => {
    inputRef.current?.focus();
  }, [inputRef]);

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: isEveryCompleted,
        })}
        data-cy="ToggleAllButton"
      />

      <form onSubmit={onSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isSubmitting}
        />
      </form>
    </header>
  );
};
