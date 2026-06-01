import React, { useEffect, useRef } from 'react';
import { Todo } from '../types/Todo';
import cn from 'classnames';

type Props = {
  todos: Todo[];
  title: string;
  handleChangeCompleteAll?: () => void;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  handleTitleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isLoading: boolean;
};

export const Header: React.FC<Props> = ({
  todos,
  title,
  handleChangeCompleteAll,
  handleSubmit,
  handleTitleChange,
  isLoading,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isLoading) {
      inputRef.current?.focus();
    }
  }, [isLoading, todos.length]);

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      {todos.length > 0 && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: todos.every(todo => todo.completed),
          })}
          data-cy="ToggleAllButton"
          onClick={handleChangeCompleteAll}
          disabled={isLoading}
        />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          disabled={isLoading}
          data-cy="NewTodoField"
          type="text"
          value={title}
          onChange={handleTitleChange}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputRef}
        />
      </form>
    </header>
  );
};
