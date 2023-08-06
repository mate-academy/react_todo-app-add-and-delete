import cn from 'classnames';
import { FilterType } from '../types/FilterType';

type Props = {
  status: FilterType,
  onStatusChange: (filter: FilterType) => void,
};

export const TodoFilter: React.FC<Props> = ({ status, onStatusChange }) => {
  const handleStatusChange
  = (filterType: FilterType) => () => onStatusChange(filterType);

  return (
    <nav className="filter">
      <a
        href="#/"
        className={cn('filter__link', {
          selected: status === FilterType.All,
        })}
        onClick={handleStatusChange(FilterType.All)}
      >
        {FilterType.All}
      </a>

      <a
        href="#/active"
        className={cn('filter__link', {
          selected: status === FilterType.Active,
        })}
        onClick={handleStatusChange(FilterType.Active)}
      >
        {FilterType.Active}
      </a>

      <a
        href="#/completed"
        className={cn('filter__link', {
          selected: status === FilterType.Completed,
        })}
        onClick={handleStatusChange(FilterType.Completed)}
      >
        {FilterType.Completed}
      </a>
    </nav>
  );
};
