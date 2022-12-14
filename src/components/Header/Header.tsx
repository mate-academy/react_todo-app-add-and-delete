/* eslint-disable jsx-a11y/control-has-associated-label */

import React, { RefObject, useContext } from 'react';
import { Todo } from '../../types/Todo';
import { AuthContext } from '../Auth/AuthContext';

type Props = {
  newTodoField: RefObject<HTMLInputElement>;
  query: string;
  isDisabledInput: boolean;
  onQueryChange: (value: string) => void;
  onErrorChange: (value: boolean) => void;
  onAddNewTodo: (value: Todo) => void;
};

export const Header: React.FC<Props> = ({
  newTodoField,
  query,
  isDisabledInput,
  onQueryChange,
  onErrorChange,
  onAddNewTodo,
}) => {
  const user = useContext(AuthContext);

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (query.length === 0) {
      onErrorChange(true);

      setTimeout(() => {
        onErrorChange(false);
      }, 3000);

      return;
    }

    if (user) {
      onAddNewTodo({
        id: 0,
        userId: user.id,
        title: query,
        completed: false,
      });
    }

    onQueryChange('');
  };

  return (
    <header className="todoapp__header">
      <button
        data-cy="ToggleAllButton"
        type="button"
        className="todoapp__toggle-all active"
      />

      <form
        onSubmit={handleFormSubmit}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          disabled={isDisabledInput}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
        />
      </form>
    </header>
  );
};
