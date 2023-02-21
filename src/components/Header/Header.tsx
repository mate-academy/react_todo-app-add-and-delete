import React, { useEffect, useState } from 'react';
import cn from 'classnames';

type Props = {
  addNewTodo: (title: string) => void;
  updateAllTodosStatus: (isCompleted: boolean) => void;
  isAllTodosCompleted: boolean;
};

export const Header: React.FC<Props> = React.memo(({
  addNewTodo,
  updateAllTodosStatus,
  isAllTodosCompleted,
}) => {
  const [query, setQuery] = useState('');
  const [isTitleEmpty, setIsTitleEmpty] = useState(false);
  const [isAllCompleted, setIsAllCompleted] = useState(false);

  useEffect(() => {
    setIsAllCompleted(isAllTodosCompleted);
  }, [isAllTodosCompleted]);

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setIsTitleEmpty(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (query) {
      addNewTodo(query.trim());
      setQuery('');
      setIsTitleEmpty(false);
    } else {
      setIsTitleEmpty(true);
    }
  };

  const toggleTodosStatusForAll = () => {
    setIsAllCompleted(currentStatus => {
      return !currentStatus;
    });
    updateAllTodosStatus(!isAllCompleted);
  };

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      <button
        type="button"
        // eslint-disable-next-line
        className={cn('todoapp__toggle-all', { 'active': isAllCompleted })}
        aria-label="Toogle all"
        onClick={toggleTodosStatusForAll}
      />

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={(event) => handleInput(event)}
        />
      </form>
      {isTitleEmpty && (
        <p className="todoapp__notification-empty">
          {'Title can\'t be empty'}
        </p>
      )}
    </header>
  );
});
