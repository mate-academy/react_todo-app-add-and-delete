import cn from 'classnames';
import { FilterTypes } from '../types/FilterTypes';

interface Props {
  onSelectedFilterType: (type: FilterTypes) => void;
  clearCompletedTodos: () => void;
  selectedFilterType: FilterTypes;
  activeTodosCount: number;
  completedTodosIds: number[];
}

export const TodoFooter: React.FC<Props> = ({
  clearCompletedTodos,
  onSelectedFilterType,
  selectedFilterType,
  activeTodosCount,
  completedTodosIds,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeTodosCount} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(FilterTypes).map(value => (
          <a
            key={value}
            href={value === FilterTypes.ALL ? `#/` : `#/${value.toLowerCase()}`}
            className={cn('filter__link', {
              selected: selectedFilterType === value,
            })}
            data-cy={`FilterLink${value}`}
            onClick={() => onSelectedFilterType(value)}
          >
            {value}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!completedTodosIds.length}
        onClick={clearCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
