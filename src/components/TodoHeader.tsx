import React, { useState, FormEvent, useEffect } from 'react';
import '../styles/index.scss';

interface Props {
  isLoading: boolean;
  onAdd: (title: string) => Promise<void>;
  inputRef: React.RefObject<HTMLInputElement>;
}

const TodoHeader: React.FC<Props> = ({ isLoading, onAdd, inputRef }) => {
  const [newTitle, setNewTitle] = useState<string>('');

  useEffect(() => {
    const timeout = setTimeout(() => {
      inputRef.current?.focus();
    }, 500);

    return () => clearTimeout(timeout);
  }, [inputRef]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      await onAdd(newTitle);
      setNewTitle('');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to add todo:', error);
    }
  };

  return (
    <header className="todoapp__header" data-cy="Header">
      <form onSubmit={handleSubmit}>
        <input
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
          disabled={isLoading}
          data-cy="NewTodoField"
          ref={inputRef}
          tabIndex={0}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="todoapp__add-button"
          data-cy="AddTodoButton"
        ></button>
      </form>
    </header>
  );
};

export default React.memo(TodoHeader);
