import React, { useState } from 'react';
import cN from 'classnames';

type Props = {
  hasActive: boolean;
  onSubmit: (title: string) => void;
  hasTodos: boolean;
};

export const TodoForm: React.FC<Props> = ({
  hasActive,
  onSubmit,
  hasTodos,
}) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setIsLoading(true);

    await onSubmit(query);

    setIsLoading(false);
    setQuery('');
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  return (
    <header className="todoapp__header">
      {hasTodos && (
        <button
          aria-label="setAllComplete"
          type="button"
          className={cN('todoapp__toggle-all', {
            active: !hasActive,
          })}
        />
      )}

      <form
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={handleChange}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
