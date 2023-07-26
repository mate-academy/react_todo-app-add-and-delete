/* eslint-disable jsx-a11y/control-has-associated-label */
import cn from 'classnames';
import { useState, useContext } from 'react';
import { TodosContext } from '../../TodosContext';

export const TodoHeader: React.FC = () => {
  const {
    todos,
    todoAdd,
    handleAllCompletedToggle,
    isEveryTodoCompleted,
    setTempTodo,
  } = useContext(TodosContext);

  const [query, setQuery] = useState('');
  const [isAllActive, setIsAllActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleOnSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    todoAdd(query)
      .catch()
      .finally(() => {
        setIsLoading(false);
        setQuery('');
        setTempTodo(null);
      });
  };

  const handleOnToggle = () => {
    setIsAllActive(prevState => !prevState);
    handleAllCompletedToggle(isAllActive);
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0
        && (
          <button
            type="button"
            className={cn('todoapp__toggle-all', {
              active: isEveryTodoCompleted(),
            })}
            onClick={handleOnToggle}
          />
        )}

      <form onSubmit={handleOnSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={event => setQuery(event.currentTarget.value)}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
