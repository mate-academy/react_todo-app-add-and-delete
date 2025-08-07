import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { FilterStatus } from '../../types/FilterStatus';

type Props = {
  todos: Todo[];
  filterStatus: FilterStatus;
  setFilterStatus: (filterStatus: FilterStatus) => void;
  onDeleteCompleted: () => void;
};

export const Filter: React.FC<Props> = ({
  todos,
  filterStatus,
  setFilterStatus,
  onDeleteCompleted,
}) => {
  const completedTodosCount = todos.filter(todo => todo.completed).length;
  const activeTodosCount = todos.length - completedTodosCount;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosCount} {activeTodosCount === 1 ? 'item' : 'items'} left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filterStatus === 'all',
          })}
          data-cy="FilterLinkAll"
          onClick={e => {
            e.preventDefault();
            setFilterStatus('all');
          }}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filterStatus === 'active',
          })}
          data-cy="FilterLinkActive"
          onClick={e => {
            e.preventDefault();
            setFilterStatus('active');
          }}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filterStatus === 'completed',
          })}
          data-cy="FilterLinkCompleted"
          onClick={e => {
            e.preventDefault();
            setFilterStatus('completed');
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
        disabled={completedTodosCount === 0}
        onClick={onDeleteCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
