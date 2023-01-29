import React, { useState, FormEvent } from 'react';

type HeaderProps = {
  newTodoField: React.RefObject<HTMLInputElement>;
  showError: (message: string) => void
};

export const Header: React.FC<HeaderProps> = ({ newTodoField, showError }) => {
  const [title, setTitle] = useState('');

  const onSubmitForm = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title) {
      showError('Title is required');
    }
  };

  return (
    <header className="todoapp__header">
      {/* eslint-disable-next-line */}
      <button
        data-cy="ToggleAllButton"
        type="button"
        className="todoapp__toggle-all active"
      />

      <form onSubmit={onSubmitForm}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
        />
      </form>
    </header>
  );
};
