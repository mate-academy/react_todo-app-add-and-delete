/* eslint-disable jsx-a11y/control-has-associated-label */

import cn from 'classnames';
import React from 'react';

type Props = {
  hasTodos: boolean;
  allTodosCompleted: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  title: string;
  disabled: boolean;
  onTitleChange: (title: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onToggleAll: () => void;
};

export const TodoAppHeader: React.FC<Props> = ({
  hasTodos,
  allTodosCompleted,
  inputRef,
  title,
  disabled,
  onTitleChange,
  onSubmit,
  onToggleAll,
}) => (
  <header className="todoapp__header">
    {hasTodos && (
      <button
        type="button"
        className={cn('todoapp__toggle-all', {
          active: allTodosCompleted,
        })}
        data-cy="ToggleAllButton"
        onClick={onToggleAll}
      />
    )}

    <form onSubmit={onSubmit}>
      <input
        ref={inputRef}
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={title}
        disabled={disabled}
        onChange={event => onTitleChange(event.target.value)}
      />
    </form>
  </header>
);
