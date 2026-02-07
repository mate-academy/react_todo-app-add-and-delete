import React, { forwardRef } from 'react';
import { Button } from '../Button/Button';
import { Todo } from '../../types/Todo';

type Props = {
  titleTodo: string;
  tempTodo: Todo | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (event: React.FormEvent) => void;
};

export const Header = forwardRef<HTMLInputElement, Props>(
  ({ onChange, onSubmit, titleTodo, tempTodo }, ref) => {
    return (
      <header className="todoapp__header">
        {/* this button should have `active` class only if all todos are completed */}
        <Button
          type="button"
          className="todoapp__toggle-all
                active"
          dataCy="ToggleAllButton"
        />
        {/* Add a todo on form submit */}
        <form onSubmit={onSubmit}>
          <input
            data-cy="NewTodoField"
            type="text"
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
            onChange={onChange}
            value={titleTodo}
            ref={ref}
            disabled={!!tempTodo}
          />
        </form>
      </header>
    );
  },
);

Header.displayName = 'Header';
