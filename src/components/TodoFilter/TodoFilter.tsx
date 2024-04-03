import cn from 'classnames';

import { Filter } from '../../types/Filter';

type Props = {
  currentFilter: Filter;
  onClick: (filter: Filter) => void;
};

export const TodoFilter: React.FC<Props> = ({ currentFilter, onClick }) => {
  const { ALL, ACTIVE, COMPLETED } = Filter;

  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={cn('filter__link', {
          selected: currentFilter === ALL,
        })}
        data-cy="FilterLinkAll"
        onClick={() => onClick(ALL)}
      >
        {ALL}
      </a>

      <a
        href="#/active"
        className={cn('filter__link', {
          selected: currentFilter === ACTIVE,
        })}
        data-cy="FilterLinkActive"
        onClick={() => onClick(ACTIVE)}
      >
        {ACTIVE}
      </a>

      <a
        href="#/completed"
        className={cn('filter__link', {
          selected: currentFilter === COMPLETED,
        })}
        data-cy="FilterLinkCompleted"
        onClick={() => onClick(COMPLETED)}
      >
        {COMPLETED}
      </a>
    </nav>
  );
};
