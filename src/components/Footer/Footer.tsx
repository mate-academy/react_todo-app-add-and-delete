import { TodoFilter } from '../../types/TodoFilter';
import './Footer.scss';

import cn from 'classnames';

type Props = {
  completedCount: number;
  onHandleGroupBy: (typeGroupBy: TodoFilter) => void;
  groupBy: TodoFilter;
  isOneTodosCompleted: boolean;
  onClickDeleteAllCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  completedCount,
  onHandleGroupBy,
  groupBy,
  isOneTodosCompleted,
  onClickDeleteAllCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${completedCount} items left`}
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: groupBy === TodoFilter.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => onHandleGroupBy(TodoFilter.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: groupBy === TodoFilter.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => onHandleGroupBy(TodoFilter.Active)}
        >
          Active
        </a>
        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: groupBy === TodoFilter.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => onHandleGroupBy(TodoFilter.Completed)}
        >
          Completed
        </a>
      </nav>

      {/* this button should be disabled if there are no completed todos */}

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!isOneTodosCompleted}
        onClick={onClickDeleteAllCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
