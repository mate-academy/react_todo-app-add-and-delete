import { useContext, useState } from 'react';
import classNames from 'classnames';

import { TodoContext } from '../contexts/TodoContext';
import { TodoStatus } from '../types/TodoStatus';

export const Footer: React.FC = () => {
  const {
    todos,
    setFilters,
    idsToUpdate,
    deleteTodoById,
  } = useContext(TodoContext);
  const [selectedFilter, setSelectedFilter] = useState('all');

  const handleStatusFilter = (value: TodoStatus) => () => {
    setFilters({ status: value });
    setSelectedFilter(value);
  };

  const uncompletedTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  const handleClear = () => {
    completedTodos.forEach(todo => {
      idsToUpdate(todo.id);
      deleteTodoById(todo.id);
    });
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${uncompletedTodos.length} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames(
            'filter__link',
            { selected: selectedFilter === TodoStatus.All },
          )}
          data-cy="FilterLinkAll"
          onClick={handleStatusFilter(TodoStatus.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames(
            'filter__link',
            { selected: selectedFilter === 'uncompleted' },
          )}
          data-cy="FilterLinkActive"
          onClick={handleStatusFilter(TodoStatus.Uncompleted)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames(
            'filter__link',
            { selected: selectedFilter === TodoStatus.Completed },
          )}
          data-cy="FilterLinkCompleted"
          onClick={handleStatusFilter(TodoStatus.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!completedTodos.length}
        onClick={handleClear}
      >
        Clear completed
      </button>
    </footer>
  );
};
