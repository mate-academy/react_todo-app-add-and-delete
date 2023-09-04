import classNames from 'classnames';
import { ActiveFilter } from '../../types/ActiveFilter';

type Props = {
  activeFilter: ActiveFilter,
  setActiveFilter: (value: ActiveFilter) => void,
};

export const Filter: React.FC<Props> = ({ activeFilter, setActiveFilter }) => {
  const isItActiveFilter = (filter: ActiveFilter) => activeFilter === filter;

  return (
    <nav className="filter">
      <a
        href="#/"
        className={classNames('filter__link', {
          selected: isItActiveFilter(ActiveFilter.All),
        })}
        onClick={() => setActiveFilter(ActiveFilter.All)}
      >
        {ActiveFilter.All}
      </a>

      <a
        href="#/active"
        className={classNames('filter__link', {
          selected: isItActiveFilter(ActiveFilter.Active),
        })}
        onClick={() => setActiveFilter(ActiveFilter.Active)}
      >
        {ActiveFilter.Active}
      </a>

      <a
        href="#/completed"
        className={classNames('filter__link', {
          selected: isItActiveFilter(ActiveFilter.Completed),
        })}
        onClick={() => setActiveFilter(ActiveFilter.Completed)}
      >
        {ActiveFilter.Completed}
      </a>
    </nav>
  );
};
