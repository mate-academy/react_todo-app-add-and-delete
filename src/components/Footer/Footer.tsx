import cn from 'classnames';
import { FilterType } from '../../types/Todo';

export interface FooterProps {
  activeTasks: number;
  completedTasks: number;
  state: FilterType;
  onStageChange: (stage: FilterType) => void;
  onDeleteCompleted: () => void;
}

export const Footer = ({
  activeTasks,
  onStageChange,
  state,
  completedTasks,
  onDeleteCompleted,
}: FooterProps) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTasks} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(FilterType).map(filterValue => {
          const isSelected = state === filterValue;
          const hrefValue =
            filterValue === FilterType.ALL ? '' : `#/${filterValue}`;

          return (
            <a
              key={filterValue}
              href={hrefValue}
              className={cn('filter__link', { selected: isSelected })}
              data-cy={`FilterLink${filterValue}`}
              onClick={() => onStageChange(filterValue)}
            >
              {filterValue}
            </a>
          );
        })}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={completedTasks === 0}
        onClick={onDeleteCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
