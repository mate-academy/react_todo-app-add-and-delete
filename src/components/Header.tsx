import React, { FormEvent, Ref } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  onSubmit: (e: FormEvent) => void;
  onChange: (value: string) => void;
  todos: Todo[];
  inputRef: Ref<HTMLInputElement> | null;
  isTitle: string;
  loading: boolean;
};

export const Header: React.FC<Props> = ({
  onSubmit,
  onChange,
  todos,
  inputRef,
  isTitle,
  loading,
}) => {
  const allTodosCompleted = todos.every(todo => todo.completed);

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      {todos.length > 0 && (
        <button
          type="button"
          className={`todoapp__toggle-all ${allTodosCompleted ? 'active' : ''}`}
          data-cy="ToggleAllButton"
        />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={onSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          value={isTitle}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={e => onChange(e.target.value)}
          disabled={loading}
        />
      </form>
    </header>
  );
};
