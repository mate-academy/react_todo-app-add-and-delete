import cn from 'classnames';
import { FilterType } from '../../types/FilterType';

type TodoFooterProps = {
  todosCountActive: number;
  filter: FilterType;
  onChangeFilter: (f: FilterType) => void;
  canClearCompleted: boolean;
  onClearCompleted: () => void;
};

export const TodoFooter: React.FC<TodoFooterProps> = ({
  todosCountActive,
  filter,
  onChangeFilter,
  canClearCompleted,
  onClearCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todosCountActive + ' items left'}
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: filter === FilterType.All,
          })}
          data-cy="FilterLinkAll"
          onClick={e => {
            e.preventDefault();
            onChangeFilter(FilterType.All);
          }}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: filter === FilterType.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={e => {
            e.preventDefault();
            onChangeFilter(FilterType.Active);
          }}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: filter === FilterType.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={e => {
            e.preventDefault();
            onChangeFilter(FilterType.Completed);
          }}
        >
          Completed
        </a>
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!canClearCompleted}
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
