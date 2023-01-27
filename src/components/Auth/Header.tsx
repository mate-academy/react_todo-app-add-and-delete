/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { FormEvent, useContext, useState } from 'react';
import { AuthContext } from './AuthContext';
import { Todo } from '../../types/Todo';

export type Props = {
  newTodoField: React.RefObject<HTMLInputElement>
  showError: (v: string) => void;
  isAdd: boolean;
  onAdd: (v: Omit<Todo, 'id'>) => void;
};

export const Header: React.FC<Props> = ({
  newTodoField,
  showError,
  isAdd,
  onAdd,
}) => {
  const [title, setTitle] = useState('');
  const user = useContext(AuthContext);

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title) {
      showError('Title is required!');

      return;
    }

    if (!user) {
      showError('User not found!');

      return;
    }

    onAdd({
      title,
      userId: user.id,
      completed: false,
    });

    setTitle('');
  };

  return (
    <header className="todoapp__header">
      <button
        data-cy="ToggleAllButton"
        type="button"
        className="todoapp__toggle-all active"
      />

      <form onSubmit={handleFormSubmit}>
        <input
          disabled={isAdd}
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
        />
      </form>
    </header>
  );
};
