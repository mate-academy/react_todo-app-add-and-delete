import cn from 'classnames';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';

type Filter = {
  key: string;
  label: string;
  link: string;
  dataCy: string;
};

const FILTERS: Filter[] = [
  { key: 'all', label: 'All', link: '#/', dataCy: 'FilterLinkAll' },
  {
    key: 'active',
    label: 'Active',
    link: '#/active',
    dataCy: 'FilterLinkActive',
  },
  {
    key: 'completed',
    label: 'Completed',
    link: '#/completed',
    dataCy: 'FilterLinkCompleted',
  },
];

type TodoProps = {
  filter: string;
  onFilterChange: (filter: string) => void;
  onClearCompleted: () => void;
  incompleteCount: number;
  hasCompletedTodos: boolean;
};
//
export const Footer: React.FC<TodoProps> = ({
  filter,
  onFilterChange,
  onClearCompleted,
  incompleteCount,
  hasCompletedTodos,
}) => {


  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${incompleteCount} items left`}
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        {FILTERS.map(FILTER => {
          return (
            <a
              href={FILTER.link}
              className={classNames('filter__link', {
                selected: filter === FILTER.key,
              })}
              data-cy={FILTER.dataCy}
              onClick={() => onFilterChange(FILTER.key)}
              key={FILTER.key}
            >
              {FILTER.label}
            </a>
          );
        })}
      </nav>

      {/* this button should be disabled if there are no completed todos */}

      <button
        type="button"
        className={cn('todoapp__clear-completed')}
        data-cy="ClearCompletedButton"
        onClick={onClearCompleted}
        disabled={!hasCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
