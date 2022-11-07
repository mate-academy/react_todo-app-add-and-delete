import React from 'react';

type Props = {
  isAdding: boolean,
  handleAddTodo: (event: React.FormEvent<HTMLFormElement>) => void,
  newTodoField: React.RefObject<HTMLInputElement>,
  newTitle: string,
  handleNewTitle: (event: React.ChangeEvent<HTMLInputElement>) => void,
};

export const AddTodoField:React.FC<Props> = ({
  isAdding,
  handleAddTodo,
  newTodoField,
  newTitle,
  handleNewTitle,
}) => {
  return (
    <header className="todoapp__header">
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        data-cy="ToggleAllButton"
        type="button"
        className="todoapp__toggle-all active"
      />

      <form onSubmit={handleAddTodo}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTitle}
          disabled={isAdding}
          onChange={(event) => handleNewTitle(event)}
        />
      </form>
    </header>
  );
};
