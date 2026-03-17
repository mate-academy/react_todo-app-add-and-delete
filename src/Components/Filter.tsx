import { FILTERS, FilterType } from '../constants/filter';

type Props = {
  filter: FilterType;
  setFilter: (value: FilterType) => void;
};

export const Filter: React.FC<Props> = ({ filter, setFilter }) => {
  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={`filter__link ${filter === FILTERS.ALL ? 'selected' : ''}`}
        data-cy="FilterLinkAll"
        onClick={e => {
          e.preventDefault();
          setFilter(FILTERS.ALL);
        }}
      >
        All
      </a>

      <a
        href="#/active"
        className={`filter__link ${filter === FILTERS.ACTIVE ? 'selected' : ''}`}
        data-cy="FilterLinkActive"
        onClick={e => {
          e.preventDefault();
          setFilter(FILTERS.ACTIVE);
        }}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={`filter__link ${filter === FILTERS.COMPLETED ? 'selected' : ''}`}
        data-cy="FilterLinkCompleted"
        onClick={e => {
          e.preventDefault();
          setFilter(FILTERS.COMPLETED);
        }}
      >
        Completed
      </a>
    </nav>
  );
};
