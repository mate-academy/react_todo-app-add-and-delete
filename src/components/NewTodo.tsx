import React, { FormEvent, RefObject } from 'react';

type Props = {
  title: string;
  onTitleChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  isAdding: boolean;
  inputRef: RefObject<HTMLInputElement>;
};

export const NewTodo: React.FC<Props> = ({
  title,
  onTitleChange,
  onSubmit,
  isAdding,
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
      onChange={event => onTitleChange(event.target.value)}
      disabled={isAdding}
      autoFocus
    />
  </form>
);
