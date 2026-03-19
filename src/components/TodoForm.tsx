import React from 'react';

interface TodoFormProps {
  title: string;
  onTitleChange: (title: string) => void;
  onSubmit: (event: React.FormEvent) => void;
  isDisabled: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
}

export const TodoForm: React.FC<TodoFormProps> = ({
  title,
  onTitleChange,
  onSubmit,
  isDisabled,
  inputRef,
}) => {
  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      <form onSubmit={onSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={event => onTitleChange(event.target.value)}
          disabled={isDisabled}
        />
      </form>
    </header>
  );
};
