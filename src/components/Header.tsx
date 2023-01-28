import React, { FormEvent, RefObject } from 'react';

type Props = {
  newTodoField: RefObject<HTMLInputElement>;
  title: string;
  setTitle: (title: string) => void;
  handleAddToto: (title: string) => void;
};

/* eslint-disable jsx-a11y/control-has-associated-label */
export const Header: React.FC<Props> = ({
  newTodoField,
  title,
  setTitle,
  handleAddToto,
}) => {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleAddToto(title);
  };

  return (
    <header className="todoapp__header">
      <button
        data-cy="ToggleAllButton"
        type="button"
        className="todoapp__toggle-all active"
      />
      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </form>
    </header>
  );
};
