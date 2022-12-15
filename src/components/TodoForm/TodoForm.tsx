import React, { RefObject, useContext } from 'react';
import { Error } from '../../types/Error';
import { Todo } from '../../types/Todo';
import { AuthContext } from '../Auth/AuthContext';

type Props = {
  newTodoField: RefObject<HTMLInputElement>;
  query: string;
  onQueryChange: (value: string) => void;
  onErrorChange: (value: boolean) => void;
  onAddNewTodo: (value: Todo) => void;
  isDisabledInput: boolean;
};

export const TodoForm: React.FC<Props> = ({
  newTodoField,
  query,
  onQueryChange,
  onErrorChange,
  onAddNewTodo,
  isDisabledInput,
}) => {
  const user = useContext(AuthContext);

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!query.length) {
      onErrorChange(Error.Title);

      setTimeout(() => {
        onErrorChange(Error.None);
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
