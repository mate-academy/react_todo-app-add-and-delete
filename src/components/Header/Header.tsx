import React, { memo, useEffect, useState } from 'react';

interface Props {
  newTodoField: React.RefObject<HTMLInputElement>;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  setHasError: React.Dispatch<React.SetStateAction<boolean>>;
  isAdding: boolean;
  onAddNewTodo: (newTitle: string) => Promise<void>;
}

export const Header: React.FC<Props> = memo(({
  newTodoField,
  setErrorMessage,
  setHasError,
  isAdding,
  onAddNewTodo,
}) => {
  const [newTodoTitle, setNewTodoTitle] = useState('');

  useEffect(() => {
    setHasError(false);
  }, []);

  const handleSubmitNewTodo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (newTodoTitle.length < 1 || !newTodoTitle.trim()) {
      setHasError(true);
      setErrorMessage('Title can\'t be empty');
    }

    if (newTodoTitle.trim()) {
      onAddNewTodo(newTodoTitle);
      setNewTodoTitle('');
    }
  };

  return (
    <header className="todoapp__header">
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        data-cy="ToggleAllButton"
        type="button"
        className="todoapp__toggle-all active"
      />

      <form
        onSubmit={handleSubmitNewTodo}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          value={newTodoTitle}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={e => setNewTodoTitle(e.target.value)}
          disabled={isAdding}
        />
      </form>
    </header>
  );
});
