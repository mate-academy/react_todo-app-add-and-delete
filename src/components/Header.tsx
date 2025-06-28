import React, { useEffect, useRef, useState } from 'react';

type Props = {
  onAdd: (title: string) => void;
  disabled: boolean;
};

export const Header: React.FC<Props> = ({ onAdd, disabled }) => {
  const [title, setTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(title.trim());
  };

  // #region inputRef
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [inputRef]);

  useEffect(() => {
    if (!disabled) {
      setTitle('');
      inputRef.current?.focus();
    }
  }, [disabled]);
  // #endregion

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          disabled={disabled}
          value={title}
          onChange={e => setTitle(e.target.value)}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
        />
      </form>
    </header>
  );
};
