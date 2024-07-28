import cn from 'classnames';
import { Status } from '../types/status';
import { Todo } from '../types/Todo';

type Props = {
  completedTask: Todo[];
  activeTodos: number;
  filterBy: Status;
  setFilterBy: (newFilter: Status) => void;
  deleteAllCompleted: () => void;
};

const filterOption = Object.values(Status);

const getStatusName = (status: Status) => {
  return status === Status.all
    ? 'All'
    : status === Status.active
      ? 'Active'
      : 'Completed';
};

const Footer: React.FC<Props> = ({
  filterBy,
  setFilterBy,
  deleteAllCompleted,
  activeTodos,
  completedTask,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeTodos} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {filterOption.map(option => (
          <a
            key={option}
            href={`#${option}`}
            className={cn('filter__link', { selected: filterBy === option })}
            onClick={() => setFilterBy(option)}
            data-cy={`FilterLink${getStatusName(option)}`}
          >
            {getStatusName(option)}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={deleteAllCompleted}
        disabled={completedTask.length === 0}
      >
        Clear completed
      </button>
    </footer>
  );
};

export default Footer;
