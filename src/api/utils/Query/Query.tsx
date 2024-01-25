import classNames from 'classnames';
import { useContext, useEffect, useRef } from 'react';
import { TodosContext } from '../TodoContext';
// import { TodoList } from '../TodoList';

export const Query:React.FC = () => {
  const {
    isDisabled,
    query,
    setQuery,
    filteredTodos,
    handleError,
    onSubmit,
  } = useContext(TodosContext);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (event:React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const numberOfActive = filteredTodos.filter(
    (item) => !item.completed,
  ).length;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!query.trim()) {
      handleError('Title should not be empty');
    }

    onSubmit(query.trim());
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isDisabled]);

  return (
    <header className="todoapp__header">
      {/* eslint-disable-next-line */}
      <button
        type="button"
        className={classNames(
          'todoapp__toggle-all',
          { active: numberOfActive > 0 },
        )}
        data-cy="ToggleAllButton"
      />
      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputRef}
          value={query}
          disabled={isDisabled}
          onChange={handleInputChange}
        />
      </form>
    </header>
  );
};
