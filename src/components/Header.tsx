import React, { useEffect, useState } from 'react';

type Props = {
  onAdd: (title: string) => Promise<void>;
  onError: (message: string) => void;
  loading: boolean;
};

export const Header: React.FC<Props> = ({ onAdd, onError, loading }) => {
  const [title, setTitle] = useState('');
  const [disabled, setDisabled] = useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!loading) {
      inputRef.current?.focus();
    }
  }, [loading]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      onError('Title should not be empty');

      return;
    }

    setDisabled(true);
    onError('');

    try {
      await onAdd(trimmedTitle);
      setTitle('');
    } catch {
    } finally {
      setDisabled(false);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  return (
    <header className="todoapp__header">
      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          disabled={disabled}
          value={title}
          onChange={event => setTitle(event.target.value)}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
        />
      </form>
    </header>
  );
};
