import classNames from 'classnames';
import { FilterTypes } from '../types/FilterTypes';

type Props = {
  filterValue: FilterTypes,
  setFilterValue: (newValue: FilterTypes) => void,
};

// eslint-disable-next-line
export const TodoFilter: React.FC<Props> = ({ filterValue, setFilterValue }) => (
  <nav className="filter">
    <a
      href="#/"
      onClick={() => setFilterValue(FilterTypes.ALL)}
      className={classNames(
        'filter__link',
        { selected: filterValue === FilterTypes.ALL },
      )}
    >
      All
    </a>

    <a
      href="#/"
      onClick={() => setFilterValue(FilterTypes.ACTIVE)}
      className={classNames(
        'filter__link',
        { selected: filterValue === FilterTypes.ACTIVE },
      )}
    >
      Active
    </a>

    <a
      href="#/"
      onClick={() => setFilterValue(FilterTypes.COMPLETED)}
      className={classNames(
        'filter__link',
        { selected: filterValue === FilterTypes.COMPLETED },
      )}
    >
      Completed
    </a>

  </nav>
);
