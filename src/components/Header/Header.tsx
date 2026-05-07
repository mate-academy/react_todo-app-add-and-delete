import React from 'react';

type Props = {
  title: string;
  onChange: (value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  disabled: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
};

export const Header: React.FC<Props> = ({
  title,
  onChange,
  onSubmit,
  disabled,
  inputRef,
}) => (
  <header className="todoapp__header">
    <form onSubmit={onSubmit}>
      <input
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={title}
        onChange={event => onChange(event.target.value)}
        disabled={disabled}
        ref={inputRef}
        autoFocus
      />
    </form>
  </header>
);
