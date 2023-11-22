/* eslint-disable jsx-a11y/control-has-associated-label */
import cn from 'classnames';

import { useContext } from 'react';
import { Filter } from '../types/Filter';
import { TodoContext } from '../providers/TodoProvider';
import { deleteTodo } from '../api/todos';
import { TodoError } from '../types/TodoError';

const filters: Filter[] = [
  Filter.All,
  Filter.Active,
  Filter.Completed,
];

export const Footer = () => {
  const {
    filter,
    setFilter,
    todos,
    setTodos,
    setError,
  } = useContext(TodoContext);

  const isPresentCompleted = todos.some(todo => todo.completed);

  const handleClearCompleted = () => {
    const completedTodosIds = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    completedTodosIds.forEach(id => {
      deleteTodo(id)
        .then(() => {
          setTodos(prevTodos => prevTodos.filter(todo => !todo.completed));
        })
        .catch(() => {
          setError(TodoError.Delete);
        });
    });
  };

  const todosRemaining = todos.filter(todo => !todo.completed).length;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${todosRemaining} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {filters.map(filterType => (
          <a
            key={filterType}
            href={`#/${filter !== Filter.All
              ? filter.toLowerCase()
              : ''}`}
            className={cn(
              'filter__link',
              {
                selected: filter === filterType,
              },
            )}
            data-cy={`FilterLink${filterType}`}
            onClick={() => setFilter(filterType)}
          >
            {filterType}
          </a>
        ))}
      </nav>

      {/* don't show this button if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!isPresentCompleted}
        onClick={handleClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
