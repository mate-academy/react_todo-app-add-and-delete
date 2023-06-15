import classNames from 'classnames';
import { SortBy } from '../types/SortBy';
import { Todo } from '../types/Todo';
// import { useMemo } from 'react';

type Footer = {
  onFilterAllTodos: () => void,
  onFilterActiveTodos: () => void,
  onFilterCompletedTodos: () => void,
  onClearCompleted: () => void,
  selectedFilter: SortBy
  activeTodos: number,
  todos: Todo[]
};

export const TodoFooter: React.FC<Footer> = ({
  onFilterAllTodos,
  onFilterActiveTodos,
  onFilterCompletedTodos,
  onClearCompleted,
  selectedFilter,
  activeTodos,
  todos,
}) => {
  const completedTodosLength = todos.filter(todo => todo.completed).length;

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${activeTodos} item${activeTodos !== 1 ? 's' : ''} left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={classNames(
            'filter__link',
            {
              selected: selectedFilter === SortBy.all,
            },
          )}
          onClick={onFilterAllTodos}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames(
            'filter__link',
            {
              selected: selectedFilter === SortBy.active,
            },
          )}
          onClick={onFilterActiveTodos}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames(
            'filter__link',
            {
              selected: selectedFilter === SortBy.completed,
            },
          )}
          onClick={onFilterCompletedTodos}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        // className="todoapp__clear-completed"
        className={classNames(
          'todoapp__clear-completed',
          {
            'hide-btn': completedTodosLength === 0,
          },
        )}
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
