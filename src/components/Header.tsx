import React, { Ref } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  onSubmit: (e: React.FormEvent) => void;
  onChange: (value: string) => void;
  inputRef: Ref<HTMLInputElement> | null;
  newTitle: string;
  isLoading: boolean;
  todos: Todo[];
};

export const Header: React.FC<Props> = ({
  onSubmit,
  onChange,
  newTitle,
  inputRef,
  isLoading,
  todos,
}) => {
  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={cn('todoapp__toggle-all', {
          active: todos.every(todo => todo.completed === true),
        })}
        data-cy="ToggleAllButton"
      />
      <form onSubmit={e => onSubmit(e)}>
        <input
          ref={inputRef}
          onChange={e => onChange(e.target.value)}
          value={newTitle}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
