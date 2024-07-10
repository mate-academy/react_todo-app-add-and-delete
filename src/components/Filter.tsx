import '../styles/filter.scss';
import classNames from 'classnames';
import { FilterType } from '../types/FilterType';

type Props = {
  isSelected: FilterType;
  handleSelect: (filter: FilterType) => void;
};

export const Filter: React.FC<Props> = ({ isSelected, handleSelect }) => (
  <nav className="filter" data-cy="Filter">
    <a
      href="#/"
      className={classNames('filter__link', {
        selected: isSelected === FilterType.All,
      })}
      data-cy="FilterLinkAll"
      onClick={() => handleSelect(FilterType.All)}
    >
      All
    </a>

    <a
      href="#/active"
      className={classNames('filter__link', {
        selected: isSelected === FilterType.Active,
      })}
      data-cy="FilterLinkActive"
      onClick={() => handleSelect(FilterType.Active)}
    >
      Active
    </a>

    <a
      href="#/completed"
      className={classNames('filter__link', {
        selected: isSelected === FilterType.Completed,
      })}
      data-cy="FilterLinkCompleted"
      onClick={() => handleSelect(FilterType.Completed)}
    >
      Completed
    </a>
  </nav>
);
