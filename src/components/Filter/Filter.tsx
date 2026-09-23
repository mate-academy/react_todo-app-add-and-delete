import classNames from 'classnames';
import { useRef, useState } from 'react';
import { Filters } from '../../types/Filters';

type Props = { filterBy: (filterCriteria: Filters) => void };

export const Filter = ({ filterBy }: Props) => {
  const [filterCriteria, setFilterCriteria] = useState<Filters>(Filters.ALL);

  const handleClick = useRef(
    (
      event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
      filter: Filters,
    ) => {
      event.preventDefault();

      setFilterCriteria(filter);
      filterBy(filter);
    },
  );

  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={classNames('filter__link', {
          selected: filterCriteria === Filters.ALL,
        })}
        data-cy="FilterLinkAll"
        onClick={event => handleClick.current(event, Filters.ALL)}
      >
        All
      </a>

      <a
        href="#/active"
        className={classNames('filter__link', {
          selected: filterCriteria === Filters.ACTIVE,
        })}
        data-cy="FilterLinkActive"
        onClick={event => handleClick.current(event, Filters.ACTIVE)}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={classNames('filter__link', {
          selected: filterCriteria === Filters.COMPLETED,
        })}
        data-cy="FilterLinkCompleted"
        onClick={event => handleClick.current(event, Filters.COMPLETED)}
      >
        Completed
      </a>
    </nav>
  );
};
