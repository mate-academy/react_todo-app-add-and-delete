import classNames from 'classnames';
import { useState } from 'react';

type Props = {
  filter: (query: string) => void;
};

export const Filter: React.FC<Props> = ({ filter }) => {
  const [query, setQuery] = useState('all');

  const selectFilter = (selected: string) => {
    setQuery(selected);
    filter(selected);
  };

  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={classNames('filter__link', { selected: query === 'all' })}
        data-cy="FilterLinkAll"
        onClick={() => selectFilter('all')}
      >
        All
      </a>

      <a
        href="#/active"
        className={classNames('filter__link', { selected: query === 'active' })}
        data-cy="FilterLinkActive"
        onClick={() => selectFilter('active')}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={classNames('filter__link', {
          selected: query === 'completed',
        })}
        data-cy="FilterLinkCompleted"
        onClick={() => selectFilter('completed')}
      >
        Completed
      </a>
    </nav>
  );
};
