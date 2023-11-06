import cn from 'classnames';
import { useState } from 'react';
import { FilterType } from '../../types/FilterType';

type Props = {
  filterTodo: (value: FilterType) => void,
  selectedTodoFilter: FilterType,
};
export const TodoFilter: React.FC<Props> = ({
  filterTodo, selectedTodoFilter,
}) => {
  const [selected, setSelected] = useState(true);

  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={cn(
          'filter__link', {
            selected,
          },
        )}
        data-cy="FilterLinkAll"
        onClick={() => {
          filterTodo(FilterType.ALL);
          setSelected(true);
        }}
      >
        All
      </a>

      <a
        href="#/active"
        className={cn(
          'filter__link', {
            selected: FilterType.ACTIVE === selectedTodoFilter,
          },
        )}
        data-cy="FilterLinkActive"
        onClick={() => {
          filterTodo(FilterType.ACTIVE);
          setSelected(false);
        }}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={cn(
          'filter__link', {
            selected: FilterType.COMPLETED === selectedTodoFilter,
          },
        )}
        data-cy="FilterLinkCompleted"
        onClick={() => {
          filterTodo(FilterType.COMPLETED);
          setSelected(false);
        }}
      >
        Completed
      </a>
    </nav>
  );
};
