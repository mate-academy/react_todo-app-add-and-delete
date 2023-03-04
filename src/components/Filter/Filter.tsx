import classNames from 'classnames';
import { useState } from 'react';

type Props = {
  setFilter: (filter?: boolean) => void
};

enum TypeFilter {
  'all',
  'active',
  'completed',
}

export const Filter: React.FC<Props> = ({ setFilter }) => {
  const [typeFilter, setTypeFilter] = useState(TypeFilter[0]);

  const chooseFilter = (type: string, filter?: boolean) => {
    setFilter(filter);
    setTypeFilter(type);
  };

  return (
    <nav className="filter">
      <a
        href="#/"
        className={classNames('filter__link', {
          selected: typeFilter === TypeFilter[0],
        })}
        onClick={() => chooseFilter(TypeFilter[0])}
      >
        All
      </a>

      <a
        href="#/active"
        className={classNames('filter__link', {
          selected: typeFilter === TypeFilter[1],
        })}
        onClick={() => chooseFilter(TypeFilter[1], false)}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={classNames('filter__link', {
          selected: typeFilter === TypeFilter[2],
        })}
        onClick={() => chooseFilter(TypeFilter[2], true)}
      >
        Completed
      </a>
    </nav>

  );
};
