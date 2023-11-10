import React, { useContext } from 'react';
import cn from 'classnames';
import { TodosContext } from '../../store/TodoProvider';
import { FilterType } from '../../types/Todo';

type Props = {
  onChange?: (filterBy: FilterType) => void,
};

export const TodosFilter: React.FC<Props> = ({ onChange = () => {} }) => {
  const { state } = useContext(TodosContext);

  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={cn('filter__link', {
          selected: state.filterBy === FilterType.ALL,
        })}
        onClick={() => onChange(FilterType.ALL)}
        data-cy="FilterLinkAll"
      >
        All
      </a>

      <a
        href="#/active"
        className={cn('filter__link', {
          selected: state.filterBy === FilterType.ACTIVE,
        })}
        onClick={() => onChange(FilterType.ACTIVE)}
        data-cy="FilterLinkActive"
      >
        Active
      </a>

      <a
        href="#/completed"
        className={cn('filter__link', {
          selected: state.filterBy === FilterType.COMPLETED,
        })}
        onClick={() => onChange(FilterType.COMPLETED)}
        data-cy="FilterLinkCompleted"
      >
        Completed
      </a>
    </nav>
  );
};
