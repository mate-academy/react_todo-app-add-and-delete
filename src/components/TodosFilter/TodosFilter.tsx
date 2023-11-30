import { useContext } from 'react';
import cn from 'classnames';
import { TodosContext } from '../TodosContext/TodosContext';
import { FilterOption } from '../../types/FilterOption';

export const TodosFilter: React.FC = () => {
  const { filterOption, setFilterOption } = useContext(TodosContext);

  const handleClickAll = () => {
    setFilterOption(FilterOption.All);
  };

  const handleClickActive = () => {
    setFilterOption(FilterOption.Active);
  };

  const handleClickCompleted = () => {
    setFilterOption(FilterOption.Completed);
  };

  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        data-cy="FilterLinkAll"
        className={cn(
          'filter__link',
          { selected: filterOption === FilterOption.All },
        )}
        onClick={handleClickAll}
      >
        All
      </a>

      <a
        href="#/active"
        data-cy="FilterLinkActive"
        className={cn(
          'filter__link',
          { selected: filterOption === FilterOption.Active },
        )}
        onClick={handleClickActive}
      >
        Active
      </a>

      <a
        href="#/completed"
        onClick={handleClickCompleted}
        data-cy="FilterLinkCompleted"
        className={cn(
          'filter__link',
          { selected: filterOption === FilterOption.Completed },
        )}
      >
        Completed
      </a>
    </nav>
  );
};
