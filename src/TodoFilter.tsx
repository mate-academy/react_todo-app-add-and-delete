import { FilterType } from './types/Filters';

type TodoFilterProps = {
  filterType: string,
  setFilterType(filterType: FilterType): void,
};

export const TodoFilter = ({ filterType, setFilterType }: TodoFilterProps) => {
  return (
    <nav className="filter">
      <a
        href="#/"
        className={`filter__link ${filterType === 'all' ? 'selected' : ''}`}
        onClick={() => setFilterType(FilterType.All)}
      >
        All
      </a>

      <a
        href="#/active"
        className={`filter__link ${filterType === 'active' ? 'selected' : ''}`}
        onClick={() => setFilterType(FilterType.Active)}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={`filter__link ${filterType === 'completed' ? 'selected' : ''}`}
        onClick={() => setFilterType(FilterType.Completed)}
      >
        Completed
      </a>
    </nav>
  );
};
