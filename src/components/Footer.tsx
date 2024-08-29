import classNames from 'classnames';
import { TodoState } from '../types/TodoState';

type Props = {
  activeTodos: number;
  completedTodos: number;
  activeFilter: TodoState;
  setActiveFilter: (state: TodoState) => void;
  onClearCompleted: () => void;
};

export const Footer = ({
  activeTodos,
  completedTodos,
  activeFilter,
  setActiveFilter,
  onClearCompleted,
}: Props) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodos} items left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: activeFilter === TodoState.ALL,
          })}
          data-cy="FilterLinkAll"
          onClick={() => setActiveFilter(TodoState.ALL)}
        >
          {TodoState.ALL}
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: activeFilter === TodoState.ACTIVE,
          })}
          data-cy="FilterLinkActive"
          onClick={() => setActiveFilter(TodoState.ACTIVE)}
        >
          {TodoState.ACTIVE}
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: activeFilter === TodoState.COMPLETED,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setActiveFilter(TodoState.COMPLETED)}
        >
          {TodoState.COMPLETED}
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={completedTodos === 0}
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
