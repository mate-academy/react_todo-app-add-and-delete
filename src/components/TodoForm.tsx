import React from 'react';

interface TodoFormProps {
  inputValue: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  isAdding: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
}

export const TodoForm: React.FC<TodoFormProps> = ({
  inputValue,
  onInputChange,
  onSubmit,
  isAdding,
  inputRef,
}) => (
  <form onSubmit={onSubmit}>
    <input
      data-cy="NewTodoField"
      type="text"
      className="todoapp__new-todo"
      placeholder="What needs to be done?"
      value={inputValue}
      onChange={onInputChange}
      disabled={isAdding}
      ref={inputRef}
      aria-label="Add new todo"
      autoFocus
    />
  </form>
);
