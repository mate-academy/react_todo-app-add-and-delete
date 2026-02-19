import classNames from 'classnames';
import { Filter } from '../../types/Filter';

type Props = {
  onFilterChange: (value: Filter) => void;
  hasCompleted: boolean;
  handleClearCompleted: () => void;
  countOfTodos: number;
  filter: Filter;
};

export const Footer: React.FC<Props> = ({
  onFilterChange,
  hasCompleted,
  handleClearCompleted,
  countOfTodos,
  filter,
}) => {
  const handleAllFilterClick = () => onFilterChange(Filter.All);
  const handleActiveFilterClick = () => onFilterChange(Filter.Active);
  const handleCompletedFilterClick = () => onFilterChange(Filter.Completed);

  const buttonLinks = [
    {
      href: '#/',
      dataCy: 'FilterLinkAll',
      label: 'All',
      value: Filter.All,
      onClick: handleAllFilterClick,
    },
    {
      href: '#/',
      dataCy: 'FilterLinkActive',
      label: 'Active',
      value: Filter.Active,
      onClick: handleActiveFilterClick,
    },
    {
      href: '#/',
      dataCy: 'FilterLinkCompleted',
      label: 'Completed',
      value: Filter.Completed,
      onClick: handleCompletedFilterClick,
    },
  ];

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {countOfTodos} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {buttonLinks.map(link => {
          return (
            <a
              key={link.value}
              href={link.href}
              className={classNames('filter__link', {
                selected: filter === link.value,
              })}
              data-cy={link.dataCy}
              onClick={link.onClick}
            >
              {link.label}
            </a>
          );
        })}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={() => handleClearCompleted()}
        disabled={!hasCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
