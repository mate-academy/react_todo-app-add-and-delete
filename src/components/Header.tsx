import React, { useEffect } from 'react';

type Props = {
  loading: boolean;
  onAdd: (title: string) => void;
  newTodoTitle: string;
  setNewTodoTitle: (value: string) => void;
  inputRef: React.RefObject<HTMLInputElement>;
};

function Header({
  loading,
  onAdd,
  newTodoTitle,
  setNewTodoTitle,
  inputRef,
}: Props) {
  useEffect(() => {
    if (!loading) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  }, [loading, inputRef]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loading) {
      onAdd(newTodoTitle);
    }
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
          value={newTodoTitle}
          onChange={e => setNewTodoTitle(e.target.value)}
          disabled={loading}
        />
      </form>
    </header>
  );
}

export default Header;
