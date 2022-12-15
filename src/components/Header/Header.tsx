/* eslint-disable jsx-a11y/control-has-associated-label */

import classNames from 'classnames';
import React, { useEffect, useState } from 'react';

interface Props {
  newTodoField: React.RefObject<HTMLInputElement>,
  completedTodos?: number,
  onTodoTitle: (title: string) => void,
  onErrorMessage: React.Dispatch<React.SetStateAction<string>>,
  onErrorPresence: React.Dispatch<React.SetStateAction<boolean>>,
  inputDisabled: boolean,
}

export const Header: React.FC<Props> = ({
  newTodoField,
  completedTodos,
  onTodoTitle,
  onErrorMessage,
  onErrorPresence,
  inputDisabled,
}) => {
  const [newTodoTitle, setNewTodoTitle] = useState('');

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (newTodoTitle.trim()) {
      onTodoTitle(newTodoTitle);
      setNewTodoTitle('');
    } else {
      onErrorPresence(true);
      onErrorMessage('Unable to add empty todo');
      setNewTodoTitle('');
    }
  };

  return (
    <header className="todoapp__header">
      <button
        data-cy="ToggleAllButton"
        type="button"
        className={classNames('todoapp__toggle-all active',
          { active: !completedTodos })}
      />

      <form onSubmit={handleFormSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          onChange={(event) => setNewTodoTitle(event.target.value)}
          disabled={inputDisabled}
        />
      </form>
    </header>
  );
};
