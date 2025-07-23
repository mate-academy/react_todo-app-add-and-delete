import React, { useEffect, useRef } from 'react';
import { Todo } from '../types/Todo';

interface FormProps {
  todos: Todo[];
  newNoteTitle: string;
  onTyping: (title: string) => void;
  onAdd: (e: React.FormEvent) => Promise<void>;
  disabled?: boolean;
  allCompleted: boolean;
}

export const TodoForm: React.FC<FormProps> = ({
  todos,
  newNoteTitle,
  onTyping,
  onAdd,
  disabled,
  allCompleted,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!disabled) {
      inputRef.current?.focus();
    }
  }, [disabled, newNoteTitle, todos]);

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={`todoapp__toggle-all ${allCompleted ? 'active' : ''}`}
        data-cy="ToggleAllButton"
      />

      <form onSubmit={onAdd}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputRef}
          value={newNoteTitle}
          onChange={e => onTyping(e.target.value)}
          disabled={disabled}
        />
      </form>
    </header>
  );
};
