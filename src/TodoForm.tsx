import React from 'react';

type Props = {
  inputRef: React.RefObject<HTMLInputElement>;
  title: string;
  isDisabled: boolean;
  onTitleChange: (title: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

export const TodoForm: React.FC<Props> = ({
  inputRef,
  title,
  isDisabled,
  onTitleChange,
  onSubmit,
}) => (
  <header className="todoapp__header">
    <form onSubmit={onSubmit}>
      <input
        ref={inputRef}
        className="todoapp__new-todo"
        data-cy="NewTodoField"
        type="text"
        placeholder="What needs to be done?"
        value={title}
        onChange={event => onTitleChange(event.target.value)}
        disabled={isDisabled}
      />
    </form>
  </header>
);
