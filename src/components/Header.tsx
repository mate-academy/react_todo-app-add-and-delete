import React, { forwardRef } from 'react';
import cn from 'classnames';

type Props = {
  title: string;
  onTitleChange: (value: string) => void;
  onSubmit: (event: React.FormEvent) => void;
  isToggleAllActive: boolean;
  isLoading: boolean;
};

export const Header = forwardRef<HTMLInputElement, Props>(
  ({ title, onTitleChange, onSubmit, isToggleAllActive, isLoading }, ref) => (
    <header className="todoapp__header">
      <button
        type="button"
        className={cn('todoapp__toggle-all', {
          active: isToggleAllActive,
        })}
        data-cy="ToggleAllButton"
      />

      <form onSubmit={onSubmit}>
        <input
          ref={ref}
          value={title}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={event => onTitleChange(event.target.value)}
          disabled={isLoading}
        />
      </form>
    </header>
  ),
);

Header.displayName = 'Header';
