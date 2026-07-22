import React from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';

interface Props {
  todos: Todo[];
  title: string;
  isAdding: boolean;
  titleInputRef: React.RefObject<HTMLInputElement>;
  setTitle: (title: string) => void;
  onSubmit: (event: React.FormEvent) => void;
}

export const Header: React.FC<Props> = ({
  todos,
  title,
  isAdding,
  titleInputRef,
  setTitle,
  onSubmit,
}) => {
  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: todos.length > 0 && todos.every(todo => todo.completed),
          })}
          data-cy="ToggleAllButton"
        />
      )}

      <form onSubmit={onSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={event => {
            setTitle(event.target.value);
          }}
          disabled={isAdding}
          ref={titleInputRef}
        />
      </form>
    </header>
  );
};
