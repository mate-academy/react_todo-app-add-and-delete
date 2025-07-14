import { useState, useRef, useEffect } from 'react';

type Props = {
  handleEmptyTitle: (message: string) => void;
  handleNewTitle: (newTitle: string) => Promise<boolean>;
  isLoading: boolean;
};

export const Header: React.FC<Props> = ({
  handleEmptyTitle,
  handleNewTitle,
  isLoading,
}) => {
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newTitle = input.trim();

    if (!newTitle) {
      handleEmptyTitle('Title should not be empty');

      return;
    }

    const success = await handleNewTitle(newTitle);

    if (success) {
      setInput('');
    }
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
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
