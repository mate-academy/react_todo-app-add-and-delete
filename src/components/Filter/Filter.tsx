import './Filter.scss';

import { FILTERS } from '../../constants/Filters';
import classNames from 'classnames';

type FilterLink = {
  id: string;
  path: string;
  label: string;
};

const FILTER_LABELS = {
  all: 'All',
  active: 'Active',
  completed: 'Completed',
};

const BASE_PATH = '#/';

const filterLinks: FilterLink[] = [
  {
    id: FILTERS.all,
    path: BASE_PATH,
    label: FILTER_LABELS.all,
  },

  {
    id: FILTERS.active,
    path: BASE_PATH + FILTERS.active,
    label: FILTER_LABELS.active,
  },

  {
    id: FILTERS.completed,
    path: BASE_PATH + FILTERS.completed,
    label: FILTER_LABELS.completed,
  },
];

type Props = {
  selectedFilter: string;
  onFilter: (currentFilter: string) => void;
};

export const Filter: React.FC<Props> = ({ selectedFilter, onFilter }) => {
  return (
    <nav className="filter" data-cy="Filter">
      {filterLinks.map(filterLink => {
        const { id, path, label } = filterLink;
        const isFilterSelected = selectedFilter === id;

        return (
          <a
            key={id}
            id={id}
            href={path}
            className={classNames('filter__link', {
              selected: isFilterSelected,
            })}
            data-cy={'FilterLink' + label}
            onClick={() => onFilter(id)}
          >
            {label}
          </a>
        );
      })}
    </nav>
  );
};
