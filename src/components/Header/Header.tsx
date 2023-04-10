import classNames from 'classnames';
import { useState } from 'react';

type Props = {
  hasActiveTodos: boolean;
  onTodoAdd: (title: string) => void;
  isTodoAdding: boolean;
};

export const Header: React.FC<Props> = ({
  hasActiveTodos,
  onTodoAdd,
  isTodoAdding,
}) => {
  const [query, setQuery] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await onTodoAdd(query);
    setQuery('');
  };

  return (
    <header className="todoapp__header">
      <button
        aria-label="all-active"
        type="button"
        className={classNames(
          'todoapp__toggle-all',
          { active: !hasActiveTodos },
        )}
        disabled={!hasActiveTodos}
      />

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          disabled={isTodoAdding}
        />
      </form>
    </header>
  );
};
