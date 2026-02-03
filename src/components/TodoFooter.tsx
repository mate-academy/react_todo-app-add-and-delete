import { Filter } from '../types/Filter';
import cn from 'classnames';

type Props = {
  activeTodosCount: number;
  filter: Filter;
  setFilter: (filter: Filter) => void;
  hasCompletedTodos: boolean;
  onClear: () => void;
};

const FILTER_VARIATIONS = [
  {
    label: 'All',
    value: Filter.All,
    href: '#/',
    dataCy: 'FilterLinkAll',
  },
  {
    label: 'Active',
    value: Filter.Active,
    href: '#/active',
    dataCy: 'FilterLinkActive',
  },
  {
    label: 'Completed',
    value: Filter.Completed,
    href: '#/completed',
    dataCy: 'FilterLinkCompleted',
  },
];

export const TodoFooter: React.FC<Props> = ({
  activeTodosCount,
  filter,
  setFilter,
  hasCompletedTodos,
  onClear,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {FILTER_VARIATIONS.map(variant => (
          <a
            key={variant.value}
            href={variant.href}
            className={cn('filter__link', {
              selected: filter === variant.value,
            })}
            data-cy={variant.dataCy}
            onClick={() => setFilter(variant.value)}
          >
            {variant.label}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!hasCompletedTodos}
        onClick={onClear}
      >
        Clear completed
      </button>
    </footer>
  );
};
