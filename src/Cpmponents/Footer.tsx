import cn from 'classnames';
import { Status } from '../types/status';
import { Todo } from '../types/Todo';

type Props = {
  completedTask: Todo[];
  activeTodos: number;
  filterBy: Status;
  changeFilter: (newFilter: Status) => void;
  deleteAllCompleted: () => void;
};

const Footer: React.FC<Props> = ({
  filterBy,
  changeFilter,
  deleteAllCompleted,
  activeTodos,
  completedTask,
}) => {
  const { all, active, completed } = Status;

  const handleFilter = (newFilter: Status) => {
    changeFilter(newFilter);
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeTodos} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', { selected: filterBy === all })}
          onClick={() => handleFilter(Status.all)}
          data-cy="FilterLinkAll"
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', { selected: filterBy === active })}
          onClick={() => handleFilter(Status.active)}
          data-cy="FilterLinkActive"
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', { selected: filterBy === completed })}
          onClick={() => handleFilter(Status.completed)}
          data-cy="FilterLinkCompleted"
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={() => deleteAllCompleted()}
        disabled={completedTask.length === 0}
      >
        Clear completed
      </button>
    </footer>
  );
};

export default Footer;
