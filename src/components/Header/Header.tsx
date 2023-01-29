import React, { memo } from 'react';

type Props = {
  newTodoField: React.RefObject<HTMLInputElement>,
  isAddingTodo: boolean,
  onAddTodo: (event: React.FormEvent<HTMLFormElement>) => Promise<void>,
  title: string,
  setTitle: (title: string) => void,
};

export const Header: React.FC<Props> = memo(({
  newTodoField,
  isAddingTodo,
  onAddTodo,
  title,
  setTitle,
}) => {
  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    await onAddTodo(event);

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

      <form
        onSubmit={event => handleFormSubmit(event)}
      >
        <input
          disabled={isAddingTodo}
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
});
