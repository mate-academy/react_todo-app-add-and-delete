import { useState } from 'react';
import classNames from 'classnames';
import { FILTERS } from '../../constants/filters';

interface Props {
  onSetActiveFilter: React.Dispatch<React.SetStateAction<FILTERS>>;
}

export const Filter: React.FC<Props> = ({ onSetActiveFilter }) => {
  const [selectedFilter, setSelectedFilter] = useState(FILTERS.ALL);

  const handleFilter = (filterType: FILTERS) => {
    onSetActiveFilter(filterType);
    setSelectedFilter(filterType);
  };

  return (
    // {/* Active filter should have a 'selected' class */}
    <nav className="filter">
      <a
        href="#/"
        className={classNames('filter__link', {
          selected: selectedFilter === FILTERS.ALL,
        })}
        onClick={() => handleFilter(FILTERS.ALL)}
      >
        {FILTERS.ALL}
      </a>

      <a
        href="#/active"
        className={classNames('filter__link', {
          selected: selectedFilter === FILTERS.ACTIVE,
        })}
        onClick={() => handleFilter(FILTERS.ACTIVE)}
      >
        {FILTERS.ACTIVE}
      </a>

      <a
        href="#/completed"
        className={classNames('filter__link', {
          selected: selectedFilter === FILTERS.COMPLETED,
        })}
        onClick={() => handleFilter(FILTERS.COMPLETED)}
      >
        {FILTERS.COMPLETED}
      </a>
    </nav>
  );
};
