import React, { useRef, useEffect, RefObject } from 'react';

interface Props {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (title: string) => void;
  isLoading: boolean;
  inputRef?: RefObject<HTMLInputElement>;
}

export const NewTodoField: React.FC<Props> = ({
  value,
  onChange,
  onSubmit,
  isLoading,
  inputRef: externalRef,
}) => {
  const internalRef = useRef<HTMLInputElement>(null);
  const inputRef = externalRef || internalRef;

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSubmit(value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        ref={inputRef}
        aria-label="New todo input"
        className="todoapp__new-todo"
        data-cy="NewTodoField"
        disabled={isLoading}
        onChange={e => onChange(e.target.value)}
        placeholder="What needs to be done?"
        type="text"
        value={value}
      />
    </form>
  );
};
