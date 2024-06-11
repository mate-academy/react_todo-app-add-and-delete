import cn from 'classnames';
import { Filter } from '../types/Filter';

type Props = {
  filter: Filter;
  onFilterChange: (newFilter: Filter) => void;
};

export const TodoFilterPanel: React.FC<Props> = ({
  filter,
  onFilterChange = () => {},
}) => {
  const dataCyChanger = (value: string) => {
    switch (value) {
      case Filter.All:
        return 'FilterLinkAll';
      case Filter.Active:
        return 'FilterLinkActive';
      case Filter.Completed:
        return 'FilterLinkCompleted';
      default:
        return;
    }
  };

  return (
    <nav className="filter" data-cy="Filter">
      {Object.values(Filter).map(value => (
        <a
          href={`#/${value}`}
          className={cn('filter__link', { selected: filter === value })}
          data-cy={dataCyChanger(value)}
          onClick={() => onFilterChange(value)}
          key={value}
        >
          {value}
        </a>
      ))}
    </nav>
  );
};
