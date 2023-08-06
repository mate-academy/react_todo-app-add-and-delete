import cn from 'classnames';
import { FilterType } from '../types/FilterType';

type Props = {
  status: FilterType,
  onStatusChange: (filter: FilterType) => void,
};

export const TodoFilter: React.FC<Props> = ({ status, onStatusChange }) => {
  return (
    <nav className="filter">
      <a
        href="#/"
        className={cn('filter__link', {
          selected: status === FilterType.All,
        })}
        onClick={() => onStatusChange(FilterType.All)}
      >
        {FilterType.All}
      </a>

      <a
        href="#/active"
        className={cn('filter__link', {
          selected: status === FilterType.Active,
        })}
        onClick={() => onStatusChange(FilterType.Active)}
      >
        {FilterType.Active}
      </a>

      <a
        href="#/completed"
        className={cn('filter__link', {
          selected: status === FilterType.Completed,
        })}
        onClick={() => onStatusChange(FilterType.Completed)}
      >
        {FilterType.Completed}
      </a>
    </nav>
  );
};
