import React, { FC, memo } from 'react';

export interface Props {
  newTodoField: React.RefObject<HTMLInputElement>;
  title: string,
  setTitle: React.Dispatch<React.SetStateAction<string>>,
  onAddTodo: () => void
}

export const Header: FC<Props> = memo(
  ({
    newTodoField,
    title,
    setTitle,
    onAddTodo,
  }) => {
    const handleAddTodo = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      onAddTodo();
    };

    return (
      <header className="todoapp__header">
        <form
          onSubmit={handleAddTodo}
        >
          <button
            data-cy="ToggleAllButton"
            type="button"
            className="todoapp__toggle-all active"
            aria-label="toggle"
          />

          <input
            type="text"
            value={title}
            ref={newTodoField}
            data-cy="NewTodoField"
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
            onChange={(event) => setTitle(event.target.value)}
          />
        </form>

      </header>
    );
  },
);
