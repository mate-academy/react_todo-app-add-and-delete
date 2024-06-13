import React, { useEffect, useRef } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  handleToggleAllCompleted: () => void;
  areAllCompleted: boolean;
  handleAddTodo: (event: React.FormEvent) => void;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  newTodoTitle: string;
  tempTodo: Todo | null;
  todos: Todo[];
};

export const Header: React.FC<Props> = ({
  handleToggleAllCompleted,
  areAllCompleted,
  handleAddTodo,
  handleInputChange,
  newTodoTitle,
  tempTodo,
  todos,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (tempTodo === null && inputRef.current) {
      inputRef.current.focus();
    }
  }, [tempTodo, inputRef, todos]);

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
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          onChange={handleInputChange}
          disabled={!!tempTodo}
        />
      </form>
    </header>
  );
};
