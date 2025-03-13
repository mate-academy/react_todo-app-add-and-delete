import React from 'react';

interface TodoInputProps {
  title: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const TodoInput: React.FC<TodoInputProps> = ({
  title,
  onChange,
  onSubmit,
}) => {
  return (
    <form onSubmit={onSubmit}>
      <input
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={title}
        onChange={onChange}
      />
    </form>
  );
};
//new
