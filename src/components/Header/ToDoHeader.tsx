import React from 'react';
import { Todo } from '../../types/Todo';
import { USER_ID } from '../../api/todos';
import { ErrorMessage } from '../../types/ErrorMessage';

type Props = {
  onAdd: (todo: Todo) => void;
  onError: (error: ErrorMessage) => void;
  onFocus: React.RefObject<HTMLInputElement>;
  isInput: boolean;
  query: string;
  setQuery: (title: string) => void;
};

export const TodoHeader: React.FC<Props> = ({
  onAdd,
  onError,
  onFocus,
  isInput,
  query,
  setQuery,
}) => {
  const handleSetTodo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const crearQuery = query.trim();

    if (crearQuery.length === 0) {
      onError(ErrorMessage.EmptyTitleError);

      return;
    }

    onAdd({ id: 0, userId: USER_ID, title: crearQuery, completed: false });
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={handleSetTodo}>
        <input
          data-cy="NewTodoField"
          ref={onFocus}
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={event => setQuery(event.target.value)}
          disabled={isInput}
        />
      </form>
    </header>
  );
};
