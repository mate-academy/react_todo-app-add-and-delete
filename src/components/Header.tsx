import React, { FormEventHandler, RefObject } from 'react';

type Props = {
  newTodoField: RefObject<HTMLInputElement>;
  title: string;
  setTitle: (param: string) => void;
  handleTodos: FormEventHandler<HTMLFormElement>;
};

export const Header: React.FC<Props> = ({
  newTodoField,
  title,
  setTitle,
  handleTodos,
}) => {
  return (
    <header className="todoapp__header">
      <button
        data-cy="ToggleAllButton"
        type="button"
        aria-label="toggle-active"
        className="todoapp__toggle-all active"
      />

      <form onSubmit={handleTodos}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={(event) => setTitle(event.target.value.trim())}
        />
      </form>
    </header>
  );
};
