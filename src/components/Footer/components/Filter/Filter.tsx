import './filter.scss';
import { Filter } from '../../../../types/Filter';
import { FilterItem } from '../FilterItem';

export const FilterContainer: React.FC = () => {
  const allFilters = [Filter.all, Filter.active, Filter.completed];

  return (
    <nav className="filter" data-cy="Filter">
      {allFilters.map(filter => {
        return <FilterItem value={filter} key={filter} />;
      })}
    </nav>
  );
};
