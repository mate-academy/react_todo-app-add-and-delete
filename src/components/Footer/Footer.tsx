import classNames from 'classnames';
import { Status } from '../../utils/helpers';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  selectedFilter: Status;
  setSelectedFilter: (filter: Status) => void;
};

export const Footer: React.FC<Props> = ({
  todos,
  selectedFilter,
  setSelectedFilter,
}) => {
  const activeTodosCount = todos.filter(todo => !todo.completed).length;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: selectedFilter === Status.all,
          })}
          data-cy="FilterLinkAll"
          onClick={() => setSelectedFilter(Status.all)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: selectedFilter === Status.active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => setSelectedFilter(Status.active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: selectedFilter === Status.completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setSelectedFilter(Status.completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
      >
        Clear completed
      </button>
    </footer>
  );
};
