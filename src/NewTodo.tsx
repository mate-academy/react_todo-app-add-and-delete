import React, { useEffect, useRef } from 'react';

interface Props {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  focusKey?: number;
}

export const NewTodo: React.FC<Props> = ({
  value,
  onChange,
  onSubmit,
  disabled = false,
  focusKey = 0,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!disabled) {
      inputRef.current?.focus();
    }
  }, [disabled, focusKey]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') {
      return;
    }

    event.preventDefault();

    if (disabled) {
      return;
    }

    onSubmit();
  };

  return (
    <input
      ref={inputRef}
      type="text"
      className="todoapp__new-todo"
      placeholder="What needs to be done?"
      value={value}
      disabled={disabled}
      data-cy="NewTodoField"
      onChange={e => onChange(e.target.value)}
      onKeyDown={handleKeyDown}
    />
  );
};
