import cn from 'classnames';
import { Filter } from '../types/Filter';
import { Todo } from '../types/Todo';

type Props = {
  setFilterType: (value: Filter) => void,
  filterType: Filter,
  filteredTodo: Todo[],
};
export const TodoFooter: React.FC<Props> = ({
  filterType,
  setFilterType,
  filteredTodo,
}) => {
  const filterByTodos = (filter: Filter) => {
    setFilterType(filter);
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${filteredTodo.length} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: filterType === Filter.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => filterByTodos(Filter.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: filterType === Filter.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => filterByTodos(Filter.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: filterType === Filter.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => filterByTodos(Filter.Completed)}
        >
          Completed
        </a>
      </nav>

      {/* don't show this button if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
      >
        Clear completed
      </button>
    </footer>
  );
};
