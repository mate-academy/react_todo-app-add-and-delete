import React, { FormEventHandler, RefObject } from 'react';

type Props = {
  newTodoField: RefObject<HTMLInputElement>,
  title: string,
  setTitle: (param: string) => void,
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
        aria-label="a problem"
        data-cy="ToggleAllButton"
        type="button"
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
