import { useCallback } from 'react';
import { FiltersEnum } from '../../utils/FiltersEnum';

export interface TodoFilterProps {
  setSelectedFilter: (filter: FiltersEnum) => void;
  selectedFilter: FiltersEnum;
}

export const TodoFilter: React.FC<TodoFilterProps> = ({
  setSelectedFilter,
  selectedFilter,
}) => {
  const handleSelectFilter = useCallback(
    (filter: FiltersEnum) => {
      setSelectedFilter(filter);
    },

    [setSelectedFilter],
  );

  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={`filter__link ${selectedFilter === FiltersEnum.All ? 'selected' : ''}`}
        data-cy="FilterLinkAll"
        onClick={() => handleSelectFilter(FiltersEnum.All)}
      >
        {FiltersEnum.All}
      </a>

      <a
        href="#/active"
        className={`filter__link ${selectedFilter === FiltersEnum.Active ? 'selected' : ''}`}
        data-cy="FilterLinkActive"
        onClick={() => handleSelectFilter(FiltersEnum.Active)}
      >
        {FiltersEnum.Active}
      </a>

      <a
        href="#/completed"
        className={`filter__link ${selectedFilter === FiltersEnum.Completed ? 'selected' : ''}`}
        data-cy="FilterLinkCompleted"
        onClick={() => handleSelectFilter(FiltersEnum.Completed)}
      >
        {FiltersEnum.Completed}
      </a>
    </nav>
  );
};
