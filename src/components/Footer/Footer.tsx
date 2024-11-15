import { Filter } from '../../types/Filter';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  onFilterChange: (filterType: Filter) => void;
  filter: Filter;
  onClearCompleted: () => void;
};

const filterOptions: {
  label: string;
  value: Filter;
  href: string;
  dataCy: string;
}[] = [
  { label: 'All', value: Filter.ALL, href: '#/', dataCy: 'FilterLinkAll' },
  {
    label: 'Active',
    value: Filter.ACTIVE,
    href: '#/active',
    dataCy: 'FilterLinkActive',
  },
  {
    label: 'Completed',
    value: Filter.COMPLETED,
    href: '#/completed',
    dataCy: 'FilterLinkCompleted',
  },
];

export const Footer = ({
  todos,
  onFilterChange,
  filter,
  onClearCompleted,
}: Props) => {
  const activeTodos = todos.filter(todo => !todo.completed).length;
  const atLeastOneCompleted = todos.some(todo => todo.completed);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      {/* Hide the footer if there are no todos */}

      <span className="todo-count" data-cy="TodosCounter">
        {activeTodos} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        {filterOptions.map(({ label, value, href, dataCy }) => (
          <a
            key={value}
            href={href}
            className={`filter__link ${filter === value ? 'selected' : ''}`}
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
        disabled={!atLeastOneCompleted}
        aria-hidden={!atLeastOneCompleted}
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
