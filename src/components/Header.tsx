import React from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';

export interface Props {
  todos: Todo[];
  isAllCompleted: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  title: string;
  onTitleChange: (value: string) => void;
  isSubmitting: boolean;
  onSubmit: () => void;
}

export const Header: React.FC<Props> = ({
  todos,
  isAllCompleted,
  inputRef,
  title,
  onTitleChange,
  isSubmitting,
  onSubmit,
}) => {
  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', { active: isAllCompleted })}
          data-cy="ToggleAllButton"
        />
      )}

      <form
        onSubmit={e => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputRef}
          value={title}
          onChange={e => onTitleChange(e.target.value)}
          disabled={isSubmitting}
        />
      </form>
    </header>
  );
};
