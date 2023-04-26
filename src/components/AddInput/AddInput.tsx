import cn from 'classnames';
import React, { useState } from 'react';

type Props = {
  disInput: boolean,
  setError: (title: string) => void,
  handleAddTodo: (title: string) => Promise<void>,
};

export const AddInput: React.FC<Props> = React.memo(({
  setError,
  handleAddTodo,
  disInput,
}) => {
  const [input, setInput] = useState('');

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      const title = input.trim();

      if (title) {
        await handleAddTodo(title);
        setInput('');
      } else {
        throw new Error('log');
      }
    } catch {
      setError('Title can&#8242;t be empty');
    }
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        aria-label="All"
        className={cn(
          'todoapp__toggle-all',
        )}
      />

      <form
        onSubmit={handleFormSubmit}
      >
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={disInput}
        />
      </form>
    </header>
  );
});
