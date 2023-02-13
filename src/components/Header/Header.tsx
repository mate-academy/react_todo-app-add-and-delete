import React, { Dispatch, SetStateAction, useState } from 'react';

type Props = {
  setNewTodoTitle: Dispatch<SetStateAction<string>>;
  onInputError: () => void;
  disable: boolean;
};

export const Header: React.FC<Props> = ({
  setNewTodoTitle,
  onInputError,
  disable,
}) => {
  const [titleInput, setTitleInput] = useState('');

  const handleTitleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (titleInput.length) {
      setNewTodoTitle(titleInput);
      setTitleInput('');
    }

    if (!titleInput.length) {
      onInputError();
    }
  };

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}

      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        type="button"
        className="todoapp__toggle-all active"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={handleTitleSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={titleInput}
          onChange={(event) => setTitleInput(event.target.value)}
          disabled={disable}
        />
      </form>
    </header>
  );
};
