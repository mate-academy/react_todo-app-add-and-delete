import cn from 'classnames';
import { FilterParams } from '../../types/FilterParams';

type Props = {
  filter: FilterParams;
  setFilter: (param: FilterParams) => void;
};

export const TodoFooterNav: React.FC<Props> = ({ filter, setFilter }) => {
  return (
    <nav className="filter" data-cy="Filter">
      {Object.entries(FilterParams).map(([key, value]) => {
        return (
          <a
            key={value}
            href={`#/${value}`}
            className={cn('filter__link', { selected: filter === value })}
            data-cy={`FilterLink${key}`}
            onClick={() => setFilter(value)}
          >
            {key}
          </a>
        );
      })}
    </nav>
  );
};
