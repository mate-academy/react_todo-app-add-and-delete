import React from 'react';
import classNames from 'classnames';

type Props = {
  handleToggleAllCompleted: () => void;
  areAllCompleted: boolean;
  handleAddTodo: (event: React.FormEvent) => void;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  newTodoTitle: string;
};

export const Header: React.FC<Props> = ({
  handleToggleAllCompleted,
  areAllCompleted,
  handleAddTodo,
  handleInputChange,
  newTodoTitle,
}) => {
  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: areAllCompleted,
        })}
        data-cy="ToggleAllButton"
        onClick={handleToggleAllCompleted}
      />

      {/* Add a todo on form submit */}
      <form onSubmit={handleAddTodo}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          onChange={handleInputChange}
        />
      </form>
    </header>
  );
};
