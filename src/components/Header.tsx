import React from 'react';

type Props = {
  title: string;
  isInputDisabled: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  onTitleChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
};

export const Header: React.FC<Props> = ({
  title,
  isInputDisabled,
  inputRef,
  onTitleChange,
  onSubmit,
}) => (
  <header className="todoapp__header">
    <form onSubmit={onSubmit}>
      <input
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        ref={inputRef}
        value={title}
        onChange={e => onTitleChange(e.target.value)}
        disabled={isInputDisabled}
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus
      />
    </form>
  </header>
);
