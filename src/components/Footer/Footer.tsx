import classNames from 'classnames';
import { Status } from '../../types/Status';
import { Todo } from '../../types/Todo';

interface Props {
  filterBy: Status;
  isActive: Todo[];
  setFilterBy: React.Dispatch<React.SetStateAction<Status>>;
}

export const Footer: React.FC<Props> = ({
  filterBy,
  isActive,
  setFilterBy,
}) => {
  return (
    <footer className="todoapp__footer">
      <span className="todo-count">{`${isActive.length} items left`}</span>

      <nav className="filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filterBy === Status.ALL,
          })}
          onClick={() => setFilterBy(Status.ALL)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filterBy === Status.ACTIVE,
          })}
          onClick={() => setFilterBy(Status.ACTIVE)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filterBy === Status.COMPLETED,
          })}
          onClick={() => setFilterBy(Status.COMPLETED)}
        >
          Completed
        </a>
      </nav>

      {!isActive && (
        <button type="button" className="todoapp__clear-completed">
          Clear completed
        </button>
      )}
    </footer>
  );
};
