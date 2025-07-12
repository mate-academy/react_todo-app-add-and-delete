import React from 'react';

type Props = {
  onSubmit: (e: React.FormEvent) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
};

export const Header: React.FC<Props> = ({
  onSubmit,
  inputRef,
  value,
  onChange,
  disabled,
}) => {
  return (
    <header className="todoapp__header">
      <form onSubmit={onSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={value}
          onChange={e => onChange(e.target.value)}
          disabled={disabled}
          ref={inputRef}
        />
      </form>
    </header>
  );
};
