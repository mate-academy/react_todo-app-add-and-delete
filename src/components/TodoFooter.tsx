import cn from 'classnames';
import { useTodos } from '../context/TodosProvider';
import { FilterBy } from '../types/filter';

export const TodoFooter: React.FC = () => {
  const { filter, setFilter, counter } = useTodos();

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {counter}
        {' '}
        items left
      </span>

      {/* Active filter should have a 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn(filter === FilterBy.All
            ? 'filter__link selected'
            : 'filter__link')}
          data-cy="FilterLinkAll"
          onClick={() => setFilter(FilterBy.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn(filter === FilterBy.Active
            ? 'filter__link selected'
            : 'filter__link')}
          data-cy="FilterLinkActive"
          onClick={() => setFilter(FilterBy.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn(filter === FilterBy.Completed
            ? 'filter__link selected'
            : 'filter__link')}
          data-cy="FilterLinkCompleted"
          onClick={() => setFilter(FilterBy.Completed)}
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
