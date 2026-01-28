import React, { RefObject } from 'react';
import cn from 'classnames';

type Props = {
  activeTodo: boolean;
  title: string;
  setTitle: (newTitle: string) => void;
  onSubmit: (event: React.FormEvent) => void;
  loading: boolean;
  inputRef: RefObject<HTMLInputElement>;
};

export const Header: React.FC<Props> = ({
  activeTodo,
  title,
  setTitle,
  onSubmit,
  loading,
  inputRef,
}) => {
  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className={cn('todoapp__toggle-all', {
          active: activeTodo,
        })}
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={onSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputRef}
          value={title}
          onChange={event => setTitle(event.target.value)}
          disabled={loading}
        />
      </form>
    </header>
  );
};
