import classNames from 'classnames';
import { TodoStatus } from '../../types/TodoStatus';

type Props = {
  activeTodosCount: number;
  completedTodosCount: number;
  activeFilter: TodoStatus;
  setActiveFilter: (state: TodoStatus) => void;
  onClearCompleted: () => void;
};

export const Footer = ({
  activeTodosCount,
  completedTodosCount,
  activeFilter,
  setActiveFilter,
  onClearCompleted,
}: Props) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: activeFilter === TodoStatus.all,
          })}
          data-cy="FilterLinkAll"
          onClick={() => setActiveFilter(TodoStatus.all)}
        >
          {TodoStatus.all}
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: activeFilter === TodoStatus.active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => setActiveFilter(TodoStatus.active)}
        >
          {TodoStatus.active}
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: activeFilter === TodoStatus.completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setActiveFilter(TodoStatus.completed)}
        >
          {TodoStatus.completed}
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={completedTodosCount === 0}
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
