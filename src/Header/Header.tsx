/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  newTodoTitle: string;
  onTitleChange: (title: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isAdding: boolean;
};

export const Header: React.FC<Props> = ({
  todos,
  newTodoTitle,
  onTitleChange,
  onSubmit,
  isAdding,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const allCompleted = todos.length > 0 && todos.every(todo => todo.completed);

  useEffect(() => {
    inputRef.current?.focus();
  }, [isAdding, todos.length]);

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', { active: allCompleted })}
          data-cy="ToggleAllButton"
        />
      )}

      <form onSubmit={onSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          onChange={e => onTitleChange(e.target.value)}
          disabled={isAdding}
        />
      </form>
    </header>
  );
};
