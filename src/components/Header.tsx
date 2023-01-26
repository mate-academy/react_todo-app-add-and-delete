/* eslint-disable jsx-a11y/control-has-associated-label */

import React from 'react';

type Props = {
  newTodoField: React.RefObject<HTMLInputElement>,
  onSubmitForm: (event: React.FormEvent<HTMLFormElement>) => void,
  title: string,
  setTitle: React.Dispatch<React.SetStateAction<string>>,
  isAdding: boolean,
};

export const Header: React.FC<Props> = ({
  newTodoField,
  onSubmitForm,
  title,
  setTitle,
  isAdding,
}) => {
  return (
    <header className="todoapp__header">
      <button
        data-cy="ToggleAllButton"
        type="button"
        className="todoapp__toggle-all active"
      />

      <form onSubmit={(event) => onSubmitForm(event)}>
        <input
          disabled={isAdding}
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
      </form>
    </header>
  );
};
