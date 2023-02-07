import cn from 'classnames';
import { Filters } from '../types/Filters';
import { Todo } from '../types/Todo';

type Props = {
  activeTodos: Todo[],
  completedTodos: Todo[],
  onFilterAll: () => void,
  onFilterActive: () => void,
  onFilterCompleted: () => void,
  selectedFilter: string,
  onClearCompleted: () => void,
};

export const Footer: React.FC<Props> = ({
  activeTodos,
  completedTodos,
  onFilterAll,
  onFilterActive,
  onFilterCompleted,
  selectedFilter,
  onClearCompleted,
}) => {
  const hasFilterAll = selectedFilter === Filters.All;
  const hasFilterActive = selectedFilter === Filters.Active;
  const hasFilterCompleted = selectedFilter === Filters.Completed;

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${activeTodos.length} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={cn(
            'filter__link',
            { selected: hasFilterAll },
          )}
          onClick={onFilterAll}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn(
            'filter__link',
            { selected: hasFilterActive },
          )}
          onClick={onFilterActive}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn(
            'filter__link',
            { selected: hasFilterCompleted },
          )}
          onClick={onFilterCompleted}
        >
          Completed
        </a>
      </nav>
      {completedTodos.length > 0 && (
        <button
          type="button"
          className="todoapp__clear-completed"
          onClick={onClearCompleted}

        >
          Clear completed
        </button>
      )}

    </footer>
  );
};
