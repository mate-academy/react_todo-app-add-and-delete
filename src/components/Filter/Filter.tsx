import classNames from 'classnames';
import { useState } from 'react';

type Props = {
  setFilter: (filter?: TypeFilter) => void
};

export enum TypeFilter {
  ALL = 'all',
  ACTIVE = 'active',
  COMPLETED = 'completed',
}

export const Filter: React.FC<Props> = ({ setFilter }) => {
  const [typeFilter, setTypeFilter] = useState(TypeFilter.ALL);
  const filters = Object.values(TypeFilter);

  const typeFunc = (type: TypeFilter) => {
    switch (type) {
      case TypeFilter.ALL:
        setTypeFilter(type);
        setFilter(TypeFilter.ALL);
        break;
      case TypeFilter.ACTIVE:
        setTypeFilter(type);
        setFilter(TypeFilter.ACTIVE);
        break;
      case TypeFilter.COMPLETED:
        setTypeFilter(type);
        setFilter(TypeFilter.COMPLETED);
        break;
      default:
        break;
    }
  };

  return (
    <nav className="filter">
      {filters.map((type) => (
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: typeFilter === type,
          })}
          onClick={() => typeFunc(type)}
        >
          {`${type.slice(0, 1).toUpperCase()}${type.slice(1)}`}
        </a>
      ))}
    </nav>
  );
};
