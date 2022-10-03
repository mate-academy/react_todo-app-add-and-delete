import React, { ChangeEvent, FormEvent } from 'react';

type Props = {
  newTodoField: React.RefObject<HTMLInputElement>,
  createTodo: (event: FormEvent) => void,
  setTitle: (value:string) => void,
  title: string;
};

export const Header: React.FC<Props> = ({
  newTodoField,
  createTodo,
  setTitle,
  title,
}) => {
  const handleSetTitle = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  return (
    <header className="todoapp__header">
      <button
        data-cy="ToggleAllButton"
        type="button"
        className="todoapp__toggle-all active"
        aria-label="toggle-button"
      />

      <form
        onSubmit={createTodo}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={handleSetTitle}
        />
      </form>
    </header>
  );
};
