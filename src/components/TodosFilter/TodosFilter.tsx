import React, { useContext } from 'react';
import cn from 'classnames';
import { TodosContext } from '../../store/TodoProvider';
import { FilterType } from '../../types/Todo';

type Props = {
  onChange?: (filterBy: FilterType) => void,
};

export const TodosFilter: React.FC<Props> = ({ onChange = () => {} }) => {
  const { state } = useContext(TodosContext);

  const handleFilter = (filter: FilterType) => () => onChange(filter);

  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={cn('filter__link', {
          selected: state.filterBy === FilterType.ALL,
        })}
        onClick={handleFilter(FilterType.ALL)}
        data-cy="FilterLinkAll"
      >
        All
      </a>

      <a
        href="#/active"
        className={cn('filter__link', {
          selected: state.filterBy === FilterType.ACTIVE,
        })}
        onClick={handleFilter(FilterType.ACTIVE)}
        data-cy="FilterLinkActive"
      >
        Active
      </a>

      <a
        href="#/completed"
        className={cn('filter__link', {
          selected: state.filterBy === FilterType.COMPLETED,
        })}
        onClick={handleFilter(FilterType.COMPLETED)}
        data-cy="FilterLinkCompleted"
      >
        Completed
      </a>
    </nav>
  );
};
