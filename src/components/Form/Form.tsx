import React, { useCallback, useState } from 'react';
import classNames from 'classnames';
import { ErrorType } from '../../types/ErrorType';

type Props = {
  post:(title: string) => void;
  setError: (error: ErrorType) => void;
  isDataReciving: boolean;
  activeTodosCount: number;
};

export const Form: React.FC<Props> = React.memo(({
  post, setError, isDataReciving, activeTodosCount,
}) => {
  const [query, setQuery] = useState('');

  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!query.trim()) {
      setError(ErrorType.EMPTY);
      setTimeout(() => {
        return setError(ErrorType.NOERROR);
      }, 3000);

      return;
    }

    post(query);
    setQuery('');
  }, [query]);

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames(
          'todoapp__toggle-all',
          { active: !activeTodosCount },
        )}
        aria-label="active_toggle"
      />

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={isDataReciving}
        />
      </form>
    </header>
  );
});
