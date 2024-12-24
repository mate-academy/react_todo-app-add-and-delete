import React, { useEffect } from 'react';
import { Todo } from '../../types/Todo';
import { ErrorMessage } from '../../types/ErrorMassage';

type Props = {
  onTodo: (todo: Todo) => void;
  onError: (v: string) => void;
  isInputDisabled: boolean;
  query: string;
  setQuery: (v: string) => void;
  inputRef: React.RefObject<HTMLInputElement>;
};

export const Header: React.FC<Props> = ({
  onTodo,
  onError,
  isInputDisabled,
  query,
  setQuery,
  inputRef,
}) => {
  useEffect(() => {
    if (inputRef.current && !isInputDisabled) {
      inputRef.current.focus();
    }
  }, [isInputDisabled, inputRef]);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleAddTodo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (query.trim().length > 0) {
      const newTodo = {
        id: +new Date(),
        userId: 2177,
        title: query.trim(),
        completed: false,
      };

      onTodo(newTodo);

      onError('');

      return;
    }

    onError(ErrorMessage.EmptyTitle);
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
      <form onSubmit={handleAddTodo}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          disabled={isInputDisabled}
          onChange={handleQueryChange}
          ref={inputRef}
          /* eslint-disable-next-line jsx-a11y/no-autofocus */
        />
      </form>
    </header>
  );
};
