import classNames from 'classnames';
import { Filter } from '../../types/Filter';

type Props = {
  notCompletedTodos: number;
  onFilterChange: (currentFilter: Filter) => void;
  currentFilter: Filter;
};

export const Footer: React.FC<Props> = ({
  notCompletedTodos,
  onFilterChange,
  currentFilter,
}) => {
  const filterOptions = Object.values(Filter);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {notCompletedTodos} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="currentFilter" data-cy="Filter">
        {filterOptions.map(filter => (
          <a
            key={filter}
            href={`#/${filter}`}
            className={classNames('filter__link', {
              selected: currentFilter === filter,
            })}
            // data-cy="FilterLinkAll"
            data-cy={`FilterLink${filter.charAt(0).toUpperCase() + filter.slice(1)}`}
            onClick={e => {
              e.preventDefault();
              if (currentFilter !== filter) {
                onFilterChange(filter);
              }
            }}
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
          </a>
        ))}
      </nav>

      {/* this button should be disabled if there are no completed todos */}
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
