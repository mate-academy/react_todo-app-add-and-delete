import { useContext } from 'react';
import cn from 'classnames';
import { FilterOptions } from '../../types/FilterOptions';
import { TodosContext } from '../../contexts/TodosProvider';
import { TodoAction } from '../../types/TodoAction';

export const TodosFilter = () => {
  const { filterOptions, dispatch } = useContext(TodosContext);

  const handleNewFilterOptionsSelected = (newOptions: FilterOptions) => {
    dispatch({
      type: TodoAction.SetFilterOptions,
      filterOptions: newOptions,
    });
  };

  return (
    <nav className="filter" data-cy="Filter">
      <a
        onClick={() => handleNewFilterOptionsSelected(FilterOptions.All)}
        href="#/"
        className={cn('filter__link', {
          selected: filterOptions === FilterOptions.All,
        })}
        data-cy="FilterLinkAll"
      >
        All
      </a>

      <a
        onClick={() => handleNewFilterOptionsSelected(FilterOptions.Active)}
        href="#/active"
        className={cn('filter__link', {
          selected: filterOptions === FilterOptions.Active,
        })}
        data-cy="FilterLinkActive"
      >
        Active
      </a>

      <a
        onClick={() => handleNewFilterOptionsSelected(FilterOptions.Completed)}
        href="#/completed"
        className={cn('filter__link', {
          selected: filterOptions === FilterOptions.Completed,
        })}
        data-cy="FilterLinkCompleted"
      >
        Completed
      </a>
    </nav>
  );
};
