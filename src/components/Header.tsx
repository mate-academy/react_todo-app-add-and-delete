import React, { RefObject } from 'react';

interface Props {
  title: string;
  onTitleChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  inputRef: RefObject<HTMLInputElement>;
  disabled: boolean;
}

export const Header: React.FC<Props> = ({
  title,
  onTitleChange,
  onSubmit,
  inputRef,
  disabled,
}) => {
  return (
    <header className="todoapp__header">
      <form onSubmit={onSubmit}>
        <input
          ref={inputRef}
          value={title}
          onChange={e => onTitleChange(e.target.value)}
          data-cy="NewTodoField"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={disabled}
        />
      </form>
    </header>
  );
};
