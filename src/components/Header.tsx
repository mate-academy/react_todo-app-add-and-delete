import React from 'react';
import classNames from 'classnames';

type Props = {
  newTodoTitle: string;
  setNewTodoTitle: React.Dispatch<React.SetStateAction<string>>;
  isAddingTodo: boolean;
  isAllCompleted: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  onSubmit: (event: React.FormEvent) => void;
};

export const Header: React.FC<Props> = ({
  isAllCompleted,
  newTodoTitle,
  setNewTodoTitle,
  isAddingTodo,
  inputRef,
  onSubmit,
}) => {
  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: isAllCompleted,
        })}
        data-cy="ToggleAllButton"
      />
      <form onSubmit={onSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          onChange={event => setNewTodoTitle(event.target.value)}
          disabled={isAddingTodo}
        />
      </form>
    </header>
  );
};
