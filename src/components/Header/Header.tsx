import React, { useEffect, useRef } from 'react';

export const Header: React.FC<{
  onToDoSave: (title: string) => Promise<void> | undefined;
  onTitleChange: (title: string) => void;
  initialTitle: string;
  isLoading: boolean;
}> = ({ onToDoSave, onTitleChange, initialTitle, isLoading }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current && !isLoading) {
      inputRef.current.focus();
    }
  }, [isLoading]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onToDoSave(initialTitle);
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          disabled={isLoading}
          placeholder="What needs to be done?"
          ref={inputRef}
          value={initialTitle}
          onChange={event => onTitleChange(event.target.value)}
        />
      </form>
    </header>
  );
};
