import { FC } from 'react';
import classNames from 'classnames';
import { FilterTodosBy } from '../../types/FilterTodosBy';

type Props = {
  setFilterBy: (string: string) => void,
  filterBy: string,
};
export const TodoFilter: FC<Props> = ({
  setFilterBy,
  filterBy,
}) => {
  const filteredByOptions = Object.entries(FilterTodosBy);

  return (
    <nav className="filter">

      {filteredByOptions.map(([label, value]) => (
        <a
          href={`#/${value}`}
          className={classNames('filter__link',
            { selected: filterBy === value })}
          key={value}
          onClick={() => setFilterBy(value)}
        >
          {label}
        </a>
      ))}
    </nav>
  );
};
