import React, { memo, useState } from 'react';

interface Props {
  newTodoField: React.RefObject<HTMLInputElement>,
  addTodo: (
    event: React.FormEvent<HTMLFormElement>,
    title: string
  ) => Promise<void>,
  isNewTodoLoading: boolean,
}

export const Header: React.FC<Props> = memo(({
  newTodoField,
  addTodo,
  isNewTodoLoading,
}) => {
  const [title, setTitle] = useState('');

  const handleAddTodo = async (event: React.FormEvent<HTMLFormElement>) => {
    await addTodo(event, title);

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

      <form onSubmit={(event) => handleAddTodo(event)}>
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
