import React, { useEffect, useRef } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  hasTodos: boolean;
  isAddingTodo: boolean;
  isAllCompleted: boolean;
  title: string;
  todos: Todo[];
  onTitleChange: React.ChangeEventHandler<HTMLInputElement>;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  onToggleAll: (todos: Todo[]) => void;
};

export const NewTodoForm: React.FC<Props> = ({
  hasTodos,
  isAddingTodo,
  isAllCompleted,
  title,
  todos,
  onTitleChange,
  onSubmit,
  onToggleAll,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isAddingTodo) {
      inputRef.current?.focus();
    }
  }, [isAddingTodo, todos.length]);

  return (
    <header className="todoapp__header">
      {hasTodos && (
        <button
          type="button"
          aria-label="Toggle all todos"
          className={classNames('todoapp__toggle-all', {
            active: isAllCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={() => onToggleAll(todos)}
        />
      )}

      <form onSubmit={onSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          aria-label="New todo title"
          value={title}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={onTitleChange}
          autoFocus
          disabled={isAddingTodo}
        />
      </form>
    </header>
  );
};
