import React from 'react';

type Props = {
  title: string;
  isCreating: boolean;
  fieldRef: React.RefObject<HTMLInputElement>;
  onTitleChange: (title: string) => void;
  onSubmit: (event: React.FormEvent) => void;
};

export const NewTodoForm: React.FC<Props> = ({
  title,
  isCreating,
  fieldRef,
  onTitleChange,
  onSubmit,
}) => (
  <form onSubmit={onSubmit}>
    <input
      ref={fieldRef}
      data-cy="NewTodoField"
      type="text"
      className="todoapp__new-todo"
      placeholder="What needs to be done?"
      value={title}
      disabled={isCreating}
      onChange={event => onTitleChange(event.target.value)}
      autoFocus
    />
  </form>
);
