import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { TodoFilter } from '../../types/TodoFilter';

type FooterProps = {
  todos: Todo[];
  activeTodosCounter: number;
  filterBy: TodoFilter;
  onFilterChange: (filter: TodoFilter) => void;
};

type FilterLink = {
  value: TodoFilter;
  href: string;
  label: string;
  dataCy: string;
};

const filterLinks: FilterLink[] = [
  { value: 'all', href: '#/', label: 'All', dataCy: 'FilterLinkAll' },
  {
    value: 'active',
    href: '#/active',
    label: 'Active',
    dataCy: 'FilterLinkActive',
  },
  {
    value: 'completed',
    href: '#/completed',
    label: 'Completed',
    dataCy: 'FilterLinkCompleted',
  },
];

export const Footer = ({
  todos,
  activeTodosCounter,
  filterBy,
  onFilterChange,
}: FooterProps) => {
  return (
    <>
      {todos.length > 0 && (
        <footer className="todoapp__footer" data-cy="Footer">
          <span className="todo-count" data-cy="TodosCounter">
            {activeTodosCounter} items left
          </span>

          {/* Active link should have the 'selected' class */}
          <nav className="filter" data-cy="Filter">
            {filterLinks.map(({ value, href, label, dataCy }: FilterLink) => (
              <a
                key={value}
                href={href}
                className={classNames('filter__link', {
                  selected: filterBy === value,
                })}
                data-cy={dataCy}
                onClick={() => onFilterChange(value)}
              >
                {label}
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
      )}
    </>
  );
};
