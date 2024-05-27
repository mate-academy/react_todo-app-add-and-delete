import { FC } from 'react';
import cn from 'classnames';

import { Status } from '../types/Status';

interface Props {
  activeTodosCount: number;
  selectedStatus: Status;
  setSelectedStatus: (status: Status) => void;
  deleteAllCompleted: () => void;
  clearAllVisible: boolean;
}

const Footer: FC<Props> = ({
  activeTodosCount,
  selectedStatus,
  setSelectedStatus,
  deleteAllCompleted,
  clearAllVisible,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeTodosCount} ${activeTodosCount === 1 ? 'item' : 'items'} left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', { selected: selectedStatus === 'all' })}
          data-cy="FilterLinkAll"
          onClick={() => setSelectedStatus('all')}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: selectedStatus === 'active',
          })}
          data-cy="FilterLinkActive"
          onClick={() => setSelectedStatus('active')}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: selectedStatus === 'completed',
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setSelectedStatus('completed')}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={deleteAllCompleted}
        disabled={!clearAllVisible}
      >
        Clear completed
      </button>
    </footer>
  );
};

export default Footer;
