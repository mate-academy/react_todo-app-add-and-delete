import React, { FormEvent, RefObject, useEffect } from 'react';

type Props = {
  title: string;
  onTitleChange: (value: string) => void;
  onSubmit: (event: FormEvent) => void;
  inputRef: RefObject<HTMLInputElement>;
  disabled?: boolean;
};

export const Header: React.FC<Props> = ({
  onTitleChange,
  title,
  inputRef,
  onSubmit,
  disabled,
}) => {
  useEffect(() => {
    if (!disabled && inputRef?.current) {
      inputRef.current?.focus();
    }
  }, [disabled, inputRef]);

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      <form onSubmit={onSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          ref={inputRef}
          onChange={event => onTitleChange(event.target.value)}
          disabled={disabled}
        />
      </form>
    </header>
  );
};
