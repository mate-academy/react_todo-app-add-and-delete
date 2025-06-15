import React from 'react';

type Props = {
  newTodoTitle: string;
  onTitleChange: (title: string) => void;
  onSubmit: (event: React.FormEvent) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  isAdding: boolean;
};

export const TodoInput: React.FC<Props> = ({
  newTodoTitle,
  onTitleChange,
  onSubmit,
  inputRef,
  isAdding,
}) => (
  <form onSubmit={onSubmit}>
    <input
      ref={inputRef}
      data-cy="NewTodoField"
      type="text"
      className="todoapp__new-todo"
      placeholder="What needs to be done?"
      value={newTodoTitle}
      onChange={event => onTitleChange(event.target.value)}
      disabled={isAdding}
    />
  </form>
);
