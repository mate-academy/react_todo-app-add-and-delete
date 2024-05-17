import React, { useEffect, useRef, useState } from 'react';

export const Header: React.FC<{
  onToDoSave: (title: string) => void;
  onTitleChange: (title: string) => void;
  initialTitle: string;
}> = ({ onToDoSave, onTitleChange, initialTitle }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    onToDoSave(initialTitle);
    setIsLoading(false);
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
