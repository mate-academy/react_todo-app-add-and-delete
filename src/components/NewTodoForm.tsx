import React, { useEffect, useRef } from 'react';

type Props = {
  value: string;
  onChange: (newValue: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
};

export const NewTodoForm: React.FC<Props> = ({
  value,
  onChange,
  onSubmit,
  disabled,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [disabled]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        ref={inputRef}
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        disabled={disabled}
        value={value}
        onChange={event => onChange(event.target.value)}
      />
    </form>
  );
};
