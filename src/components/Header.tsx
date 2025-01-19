import React, { useState, useRef, useEffect } from 'react';

interface HeaderProps {
  onAddTodo: (title: string) => Promise<void>;
  onMarkAllAsCompleted: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onAddTodo,
  onMarkAllAsCompleted,
}) => {
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onAddTodo(trimmedTitle);
    } finally {
      setIsSubmitting(false);
      setTitle('');
    }
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className="todoapp__toggle-all"
        data-cy="ToggleAllButton"
        onClick={onMarkAllAsCompleted}
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
          disabled={isSubmitting}
        />
      </form>
    </header>
  );
};
