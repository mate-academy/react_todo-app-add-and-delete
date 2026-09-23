import cn from 'classnames';
import { DefaultFilter } from '../../types/DefaultFilter';

type Props = {
  filterValue: string;
  onSelectFilter: (value: DefaultFilter) => void;
};

export const Filter: React.FC<Props> = ({ filterValue, onSelectFilter }) => {
  const filterOptions = [
    DefaultFilter.All,
    DefaultFilter.Active,
    DefaultFilter.Completed,
  ];

  return (
    <nav className="filter" data-cy="Filter">
      {filterOptions.map(option => (
        <a
          key={option}
          href={option === 'All' ? '#/' : `#/${option.toLowerCase()}`}
          className={cn('filter__link', {
            selected: option === filterValue,
          })}
          data-cy={`FilterLink${option}`}
          onClick={() => onSelectFilter(option)}
        >
          {option}
        </a>
      ))}
    </nav>
  );
};
