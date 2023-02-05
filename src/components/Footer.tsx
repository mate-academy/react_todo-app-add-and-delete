import cn from 'classnames';
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
            { selected: selectedFilter === 'all' },
          )}
          onClick={onFilterAll}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn(
            'filter__link',
            { selected: selectedFilter === 'active' },
          )}
          onClick={onFilterActive}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn(
            'filter__link',
            { selected: selectedFilter === 'completed' },
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
