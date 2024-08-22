import cn from 'classnames';
import { FilterParams } from '../../types/Filters';
import React from 'react';

type Props = {
  setFilterParams: (text: FilterParams) => void;
  itemsLeft: number;
  filterParams: FilterParams;
  onClearCompleted: () => void;
  isClearButtonDisabled: boolean;
};

type FilterProps = {
  name: string;
  href: string;
};

const filterStatus: FilterProps[] = [
  { name: 'All', href: '#/' },
  { name: 'Active', href: '#/active' },
  { name: 'Completed', href: '#/completed' },
];

const Footer: React.FC<Props> = ({
  setFilterParams,
  itemsLeft,
  filterParams,
  onClearCompleted,
  isClearButtonDisabled,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {itemsLeft} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        {filterStatus.map(item => (
          <a
            key={item.name}
            href={item.href}
            className={cn('filter__link', {
              selected:
                filterParams ===
                FilterParams[item.name as keyof typeof FilterParams],
            })}
            data-cy={`FilterLink${item.name}`}
            onClick={() =>
              setFilterParams(
                FilterParams[item.name as keyof typeof FilterParams],
              )
            }
          >
            {item.name}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={onClearCompleted}
        disabled={isClearButtonDisabled}
      >
        Clear completed
      </button>
    </footer>
  );
};

export default Footer;
