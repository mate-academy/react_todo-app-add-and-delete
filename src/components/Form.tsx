import React, { useEffect, RefObject } from 'react';

type FormProps = {
  onSubmit: (title: string) => void;
  fValue: string;
  onChange: (value: string) => void;
  isDisabled: boolean;
  inputRef: RefObject<HTMLInputElement>;
};

export const Form: React.FC<FormProps> = ({
  onSubmit,
  fValue,
  onChange,
  isDisabled,
  inputRef,
}) => {
  useEffect(() => {
    if (!isDisabled) {
      inputRef.current?.focus();
    }
  }, [isDisabled, inputRef]);

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        onSubmit(fValue);
      }}
    >
      <input
        ref={inputRef}
        autoFocus
        disabled={isDisabled}
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={fValue}
        onChange={event => onChange(event.target.value)}
      />
    </form>
  );
};
