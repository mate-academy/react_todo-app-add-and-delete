/* eslint-disable prettier/prettier */
import cn from 'classnames';

import { Status } from '../types/Status';

type Props = {
  notCompletedTodos: number;
  activeStatus: Status;
  setActiveStatus: (status: Status) => void;
  completedTodos: number;
  onDeleteAllCompleted: () => void;
};

export const TodoFooter: React.FC<Props> = props => {
  const {
    notCompletedTodos,
    activeStatus,
    setActiveStatus,
    completedTodos,
    onDeleteAllCompleted,
  } = props;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {notCompletedTodos} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(Status).map(status => (
          <a
            key={status}
            data-cy={`FilterLink${status}`}
            href={status === 'All' ? '#/' : `#/${status.toLowerCase()}`}
            className={cn('filter__link', {
              selected: activeStatus === status,
            })}
            onClick={() => setActiveStatus(status)}
          >
            {status}
          </a>
        ))}
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={completedTodos === 0}
        onClick={onDeleteAllCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
