import React, { RefObject, useEffect } from 'react';

type Props = {
  title: string;
  onChange: (title: string) => void;
  onAdd: (title: string) => void;
  inputRef: RefObject<HTMLInputElement>;
  disabled: boolean;
};

export const Header: React.FC<Props> = ({
  title,
  onChange,
  onAdd,
  inputRef,
  disabled,
}) => {
  useEffect(() => {
    inputRef.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(title.trim());
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          name="title"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputRef}
          value={title}
          onChange={handleChange}
          disabled={disabled}
        />
      </form>
    </header>
  );
};
