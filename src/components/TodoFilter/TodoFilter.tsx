import { memo } from 'react';
import classNames from 'classnames';
import { FilterBy } from '../../enums/FilterBy';

type Props = {
  filter: FilterBy;
  onChange: (newFilter: FilterBy) => void;
};

export const TodoFilter: React.FC<Props> = memo(({
  filter,
  onChange,
}) => (
  <nav className="filter">
    <a
      href="#/"
      className={classNames('filter__link', {
        selected: filter === FilterBy.All,
      })}
      onClick={() => onChange(FilterBy.All)}
    >
      All
    </a>

    <a
      href="#/active"
      className={classNames('filter__link', {
        selected: filter === FilterBy.Active,
      })}
      onClick={() => onChange(FilterBy.Active)}
    >
      Active
    </a>

    <a
      href="#/completed"
      className={classNames('filter__link', {
        selected: filter === FilterBy.Completed,
      })}
      onClick={() => onChange(FilterBy.Completed)}
    >
      Completed
    </a>
  </nav>
));
