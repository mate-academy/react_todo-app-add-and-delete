import { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  onTitle: (value: string) => void;
  todos: Todo[] | [];
  loading: boolean;
  error: string;
};

export const Header: React.FC<Props> = ({ onTitle, todos, loading, error }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onTitle(query.trim());
  };

  useEffect(() => {
    if (error.length === 0) {
      setQuery('');
    }

    inputRef.current?.focus();
  }, [error, todos.length]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

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
          value={query}
          onChange={e => setQuery(e.target.value)}
          disabled={loading}
        />
      </form>
    </header>
  );
};
