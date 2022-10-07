import React, { RefObject } from 'react';

type Props = {
  newTodoField: RefObject<HTMLInputElement>,
  newTitle: string,
  handleSubmit: (event: React.FormEvent) => void;
  setNewTitle: (arg: string) => void;
};

export const Header: React.FC<Props> = ({
  newTodoField,
  newTitle,
  setNewTitle,
  handleSubmit,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
  };

  return (
    <header className="todoapp__header">
      <button
        data-cy="ToggleAllButton"
        type="button"
        className="todoapp__toggle-all active"
        aria-label="toggleButton"
      />

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTitle}
          onChange={handleChange}
        />
      </form>
    </header>
  );
};
