import React, { useCallback, useState } from 'react';

type Props = {
  newTodoField: React.RefObject<HTMLInputElement>
  setHasError: (status: boolean) => void
  setErrorMessage: (message: string) => void
  addNewTodo: (title: string) => Promise<void>
  isAdding: boolean
};

export const Header: React.FC<Props> = React.memo(({
  newTodoField,
  setHasError,
  setErrorMessage,
  addNewTodo,
  isAdding,
}) => {
  const [title, setTitle] = useState('');

  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title.trim()) {
      setHasError(true);
      setErrorMessage('ToDo title can`t be empty!');

      return;
    }

    addNewTodo(title);
    setTitle('');
  }, [title]);

  return (
    <header className="todoapp__header">
      <button
        data-cy="ToggleAllButton"
        type="button"
        className="todoapp__toggle-all active"
        aria-label="Toggle All"
      />

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          disabled={isAdding}
        />
      </form>
    </header>
  );
});
