import React, { useEffect, useRef, useState } from 'react';

type Props = {
  loading: boolean;
  onAdd: (title: string) => void;
};

function Header({ loading, onAdd }: Props) {
  const [title, setTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!loading) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  }, [loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onAdd(title);
    setTitle('');
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
        disabled={loading}
      />
      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={e => setTitle(e.target.value)}
          disabled={loading}
          autoFocus
        />
      </form>
    </header>
  );
}

export default Header;
