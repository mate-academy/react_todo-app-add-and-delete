import React from 'react';

interface Props {
  title: string;
  setTitle: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  loading: boolean;
}

export const NewTodo: React.FC<Props> = ({
  title,
  setTitle,
  onSubmit,
  inputRef,
  loading,
}) => (
  <form onSubmit={onSubmit}>
    <input
      data-cy="NewTodoField"
      type="text"
      className="todoapp__new-todo"
      placeholder="What needs to be done?"
      ref={inputRef}
      value={title}
      onChange={e => setTitle(e.target.value)}
      disabled={loading}
    />
  </form>
);
