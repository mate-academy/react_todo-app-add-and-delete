import cn from 'classnames';
import { Todo } from '../../types/Todo';
import React, { forwardRef } from 'react';

type Props = {
  isAllTodosCompleted: boolean;
  title: string;
  setTitle: (t: string) => void;
  onAdd: (e: React.FormEvent<HTMLFormElement>) => void;
  tempTodo: Todo | null;
};

export const Header = forwardRef<HTMLInputElement, Props>(
  ({ isAllTodosCompleted, title, setTitle, onAdd, tempTodo }, ref) => {
    return (
      <header className="todoapp__header">
        {/* this button should have `active` class only if all todos are completed */}
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: isAllTodosCompleted,
          })}
          data-cy="ToggleAllButton"
        />

        {/* Add a todo on form submit */}
        <form onSubmit={onAdd}>
          <input
            ref={ref}
            value={title}
            name="title"
            data-cy="NewTodoField"
            type="text"
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
            onChange={e => setTitle(e.target.value)}
            disabled={tempTodo !== null}
          />
        </form>
      </header>
    );
  },
);

Header.displayName = 'Header';
