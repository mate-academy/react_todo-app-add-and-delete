import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { FilterBy } from '../types/FilterBy';

interface Props {
  active: Todo[];
  filterStatus: FilterBy;
  completedTodos: Todo[];
  handleFilterStatus: (status: FilterBy) => void;
  handleClearCompleted: () => void;
}

export const Footer: React.FC<Props> = ({
  active,
  filterStatus,
  completedTodos,
  handleFilterStatus,
  handleClearCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {active.length} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filterStatus === FilterBy.all,
          })}
          data-cy="FilterLinkAll"
          onClick={() => {
            handleFilterStatus(FilterBy.all);
          }}
        >
          {FilterBy.all}
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filterStatus === FilterBy.active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => {
            handleFilterStatus(FilterBy.active);
          }}
        >
          {FilterBy.active}
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filterStatus === FilterBy.completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => {
            handleFilterStatus(FilterBy.completed);
          }}
        >
          {FilterBy.completed}
        </a>
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        disabled={completedTodos.length === 0}
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={handleClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
