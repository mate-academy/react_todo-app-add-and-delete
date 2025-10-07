import { FilterStatus } from '../types/FilterStatus';
import { Todo } from '../types/Todo';

interface PropsFooter {
  todos: Todo[];
  filter: FilterStatus;
  onFilterChange: (option: FilterStatus) => void;
  activeCount: number;
  completedCount: number;
  onClearCompleted: () => void;
}

export const Footer: React.FC<PropsFooter> = ({
  todos,
  filter,
  onFilterChange,
  activeCount,
  completedCount,
  onClearCompleted,
}) => {
  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>,
    filterStatus: FilterStatus,
  ) => {
    event.preventDefault();
    onFilterChange(filterStatus);
  };

  return (
    <>
      {todos.length > 0 && (
        <footer className="todoapp__footer" data-cy="Footer">
          <span className="todo-count" data-cy="TodosCounter">
            {activeCount} items left
          </span>

          <nav className="filter" data-cy="Filter">
            <a
              href="#/"
              className={`filter__link ${filter === 'All' ? 'selected' : ''}`}
              data-cy="FilterLinkAll"
              onClick={e => handleClick(e, 'All')}
            >
              All
            </a>

            <a
              href="#/active"
              className={`filter__link ${filter === 'Active' ? 'selected' : ''}`}
              data-cy="FilterLinkActive"
              onClick={e => handleClick(e, 'Active')}
            >
              Active
            </a>

            <a
              href="#/completed"
              className={`filter__link ${filter === 'Completed' ? 'selected' : ''}`}
              data-cy="FilterLinkCompleted"
              onClick={e => handleClick(e, 'Completed')}
            >
              Completed
            </a>
          </nav>

          <button
            type="button"
            className="todoapp__clear-completed"
            data-cy="ClearCompletedButton"
            disabled={completedCount === 0}
            onClick={onClearCompleted}
          >
            Clear completed
          </button>
        </footer>
      )}
    </>
  );
};
