import React from 'react';
import { forwardRef, Dispatch } from 'react';

interface Props {
  addTodo: (event: React.FormEvent<HTMLFormElement>) => void;
  title: string;
  setTitle: Dispatch<React.SetStateAction<string>>;
}

export const Header = forwardRef<HTMLInputElement, Props>(
  ({ addTodo, title, setTitle }, ref) => {
    return (
      <header className="todoapp__header">
        <button
          type="button"
          className="todoapp__toggle-all active"
          data-cy="ToggleAllButton"
        />

        <form onSubmit={addTodo}>
          <input
            data-cy="NewTodoField"
            type="text"
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
            ref={ref}
            value={title}
            onChange={event => setTitle(event.target.value.trimStart())}
          />
        </form>
      </header>
    );
  },
);

Header.displayName = 'header';
