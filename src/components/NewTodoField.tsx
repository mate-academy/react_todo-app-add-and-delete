import React, { FormEvent } from 'react';

type Props = {
  value: string;
  disabled: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  onChange: (value: string) => void;
  onSubmit: () => void;
};

export const NewTodoField: React.FC<Props> = ({
  value,
  disabled,
  inputRef,
  onChange,
  onSubmit,
}) => {
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <header className="todoapp__header">
      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={value}
          disabled={disabled}
          onChange={event => onChange(event.target.value)}
          autoFocus
        />
      </form>
    </header>
  );
};
