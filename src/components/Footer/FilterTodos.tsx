import cn from 'classnames';
import { TodoStatus } from '../../types/Todo';

type FilterTodosProps = {
  selectedFilter: TodoStatus;
  setSelectedFilter: (value: TodoStatus) => void;
};

export const FilterTodos = ({
  selectedFilter,
  setSelectedFilter,
}: FilterTodosProps) => {
  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={cn('filter__link', {
          selected: selectedFilter === TodoStatus.All,
        })}
        data-cy="FilterLinkAll"
        onClick={() => setSelectedFilter(TodoStatus.All)}
      >
        All
      </a>

      <a
        href="#/active"
        className={cn('filter__link', {
          selected: selectedFilter === TodoStatus.Active,
        })}
        data-cy="FilterLinkActive"
        onClick={() => setSelectedFilter(TodoStatus.Active)}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={cn('filter__link', {
          selected: selectedFilter === TodoStatus.Completed,
        })}
        data-cy="FilterLinkCompleted"
        onClick={() => setSelectedFilter(TodoStatus.Completed)}
      >
        Completed
      </a>
    </nav>
  );
};
