/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';

type Props = {
  handleSubmit: (event: React.FormEvent) => void,
  isAdding: boolean,
  setNewText: (state: string) => void,
  newText: string,
};

export const Header: React.FC<Props> = (
  {
    handleSubmit,
    isAdding,
    setNewText,
    newText,
  },
) => {
  const handleText = (event: { target: { value: string } }) => {
    setNewText(event.target.value);
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
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newText}
          onChange={handleText}
          disabled={isAdding}
        />
      </form>
    </header>
  );
};
