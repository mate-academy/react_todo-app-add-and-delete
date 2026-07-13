import classNames from 'classnames';
import { SortType } from '../../types/SortType';

interface FooterProps {
  activeTodosCount: number;
  currentSortType: SortType;
  hasCompletedTodos: boolean;
  onSortChange: (value: SortType) => void;
  deletedAllCompleted: () => void;
}

export const Footer = ({
  activeTodosCount,
  currentSortType,
  hasCompletedTodos,
  onSortChange,
  deletedAllCompleted,
}: FooterProps) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: currentSortType === SortType.all,
          })}
          data-cy="FilterLinkAll"
          onClick={() => onSortChange(SortType.all)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: currentSortType === SortType.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => onSortChange(SortType.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: currentSortType === SortType.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => onSortChange(SortType.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!hasCompletedTodos}
        onClick={deletedAllCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
