import classNames from 'classnames';
import { FiltersList } from '../../types/FiltersList';
import React from 'react';

type Props = {
  itemsLeft: number;
  filter: FiltersList;
  onFilterChange: (value: FiltersList) => void;
  hasCompleted: boolean;
  onClearCompleted: () => void;
};

const FILTERS = [
  { link: '#/', dataCy: 'FilterLinkAll', type: FiltersList.all, title: 'All' },
  {
    link: '#/active',
    dataCy: 'FilterLinkActive',
    type: FiltersList.active,
    title: 'Active',
  },
  {
    link: '#/completed',
    dataCy: 'FilterLinkCompleted',
    type: FiltersList.completed,
    title: 'Completed',
  },
];

export const Footer: React.FC<Props> = ({
  itemsLeft,
  filter,
  onFilterChange,
  hasCompleted,
  onClearCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {itemsLeft} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {FILTERS.map(item => (
          <a
            key={item.type}
            href={item.link}
            className={classNames('filter__link', {
              selected: filter === item.type,
            })}
            data-cy={item.dataCy}
            onClick={() => onFilterChange(item.type)}
          >
            {item.title}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={hasCompleted}
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
