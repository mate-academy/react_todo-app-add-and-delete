import React, { memo } from 'react';

type Props = {
  newTodoField: React.RefObject<HTMLInputElement>,
  createTodo: (event: React.FormEvent<HTMLFormElement>) => Promise<void>,
  title: string,
  setTitle: (title: string) => void,
  isNewTodoLoading: boolean,
};

export const Header: React.FC<Props> = memo(({
  newTodoField,
  createTodo,
  title,
  setTitle,
  isNewTodoLoading,
}) => {
  const handleAddNewTodo = async (event: React.FormEvent<HTMLFormElement>) => {
    await createTodo(event);

    setTitle('');
  };

  return (
    <header className="todoapp__header">
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        data-cy="ToggleAllButton"
        type="button"
        className="todoapp__toggle-all active"
      />

      <form onSubmit={(event) => handleAddNewTodo(event)}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          disabled={isNewTodoLoading}
        />
      </form>
    </header>
  );
});
