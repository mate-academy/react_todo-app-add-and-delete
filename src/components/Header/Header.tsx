import classNames from 'classnames';
import React, { useState } from 'react';
import { Errors } from '../../types/Errors';
import { Todo } from '../../types/Todo';

type Props = {
  newTodoField: React.RefObject<HTMLInputElement>;
  todos: Todo[];
  setError: (error: Errors) => void;
  onAdd: (todoTitle: string) => void;
  isAdding: boolean;
};

export const Header: React.FC<Props> = ({
  newTodoField,
  todos,
  setError,
  onAdd,
  isAdding,
}) => {
  const [todoTitle, setTodoTitle] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTodoTitle(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (todoTitle.trim() === '') {
      setError(Errors.TITLE);

      return;
    }

    onAdd(todoTitle);
    setTodoTitle('');
  };

  return (
    <header className="todoapp__header">
      <button
        aria-label="toggle-all-button"
        data-cy="ToggleAllButton"
        type="button"
        className={classNames(
          'todoapp__toggle-all',
          { active: todos.length !== 0 },
        )}
      />

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={handleChange}
          value={todoTitle}
          disabled={isAdding}
        />
      </form>
    </header>
  );
};
