import React, { useCallback, useState } from 'react';
import classNames from 'classnames';
import { ErrorType } from '../../types/ErrorType';

type Props = {
  post:(title: string) => void;
  setError: (error: ErrorType | null) => void;
  loading: boolean;
  activeTodosCount: number;
  todosExist: boolean;
};

export const Form: React.FC<Props> = React.memo(({
  post,
  setError,
  loading,
  activeTodosCount,
  todosExist,
}) => {
  const [query, setQuery] = useState('');

  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!query.trim()) {
      setError(ErrorType.EMPTY);
      setTimeout(() => {
        return setError(null);
      }, 3000);

      return;
    }

    post(query);
    setQuery('');
  }, [query]);

  return (
    <header className="todoapp__header">
      {todosExist && (
        <button
          type="button"
          className={classNames(
            'todoapp__toggle-all',
            { active: !activeTodosCount },
          )}
          aria-label="active_toggle"
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={loading}
        />
      </form>
    </header>
  );
});
