import React, { useEffect, useRef } from 'react';
import cn from 'classnames';

import { ErrorMessages } from '../../types/ErrorMessages';

type Props = {
  todosCount: number;
  isTempTodo: boolean;
  isAllCompleted: boolean;
  query: string;
  setQuery: (query: string) => void;
  setError: (error: keyof typeof ErrorMessages) => void;
  handleAllTodoCompleted: () => void;
  handleAddTodo: (event: React.KeyboardEvent<HTMLInputElement>) => void;
};

export const Header: React.FC<Props> = ({
  todosCount,
  isTempTodo,
  isAllCompleted,
  query,
  setQuery,
  setError,
  handleAllTodoCompleted,
  handleAddTodo,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  });

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setError('Empty');
  };

  return (
    <header className="todoapp__header">
      {todosCount > 0 && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: isAllCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={handleAllTodoCompleted}
        />
      )}

      <form>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={isTempTodo}
          value={query}
          onChange={handleQueryChange}
          onKeyDown={handleAddTodo}
        />
      </form>
    </header>
  );
};
