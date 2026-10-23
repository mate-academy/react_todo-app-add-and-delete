import React from 'react';

interface NewTodoProps {
  title: string;
  disabled: boolean;
  onChange: (title: string) => void;
  onSubmit: (event: React.FormEvent) => void;
  inputRef: React.RefObject<HTMLInputElement>;
}

export const NewTodo: React.FC<NewTodoProps> = ({
  title,
  disabled,
  onChange,
  onSubmit,
  inputRef,
}) => (
  <form onSubmit={onSubmit}>
    <input
      ref={inputRef}
      data-cy="NewTodoField"
      type="text"
      className="todoapp__new-todo"
      placeholder="What needs to be done?"
      value={title}
      onChange={event => onChange(event.target.value)}
      disabled={disabled}
    />
  </form>
);
