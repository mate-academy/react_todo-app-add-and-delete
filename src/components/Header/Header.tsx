import React from 'react';

interface Props {
  addTodo: (arg: React.FormEvent<HTMLFormElement>) => void;
  title: string;
  setTitle: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isAdding: boolean;
}

// export const Header: React.FC<Props> = ({
export const Header = React.forwardRef<HTMLInputElement, Props>(
  ({ addTodo, title, setTitle, isAdding }, ref) => {
    return (
      <header className="todoapp__header">
        {/* this button should have `active` class only if all todos are completed */}
        <button
          type="button"
          className="todoapp__toggle-all active"
          data-cy="ToggleAllButton"
        />

        {/* Add a todo on form submit */}
        <form onSubmit={event => addTodo(event)}>
          <input
            name="newTodoField"
            value={title}
            data-cy="NewTodoField"
            type="text"
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
            onChange={setTitle}
            disabled={isAdding}
            ref={ref}
          />
        </form>
      </header>
    );
  },
);

Header.displayName = 'Header';
