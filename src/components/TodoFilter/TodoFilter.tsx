import classNames from 'classnames';
import { FilterType } from '../../types/FilterType';

interface Props {
  onChangeFilter: React.Dispatch<React.SetStateAction<FilterType>>;
  currentFilter: FilterType;
}

export const TodoFilter: React.FC<Props> = ({
  onChangeFilter,
  currentFilter,
}) => {
  return (
    <nav className="filter">
      <a
        href="#/"
        className={classNames('filter__link', 'all', {
          selected: currentFilter === FilterType.All,
        })}
        onClick={() => onChangeFilter(FilterType.All)}
      >
        All
      </a>

      <a
        href="#/active"
        className={classNames('filter__link', 'active', {
          selected: currentFilter === FilterType.Active,
        })}
        onClick={() => onChangeFilter(FilterType.Active)}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={classNames('filter__link', 'completed', {
          selected: currentFilter === FilterType.Completed,
        })}
        onClick={() => onChangeFilter(FilterType.Completed)}
      >
        Completed
      </a>
    </nav>
  );
};
