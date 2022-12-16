import React from 'react';

type Props = {
  newTodoField: React.RefObject<HTMLInputElement>,
  handleSubmit: (event: React.FormEvent) => void,
  todoTitle: string,
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
  isAdding: boolean
};

export const Header: React.FC<Props> = ({
  newTodoField,
  handleSubmit,
  todoTitle,
  onChange,
  isAdding,
}) => {
  return (
    <header className="todoapp__header">
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        data-cy="ToggleAllButton"
        type="button"
        className="todoapp__toggle-all active"
      />

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={onChange}
          disabled={isAdding}
        />
      </form>
    </header>
  );
};
