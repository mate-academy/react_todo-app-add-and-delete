import React from 'react';
import cn from 'classnames';

type Props = {
  onStatus:(state: string) => void;
  status: string;
  uncompletedAmount: number;
  onDeleteCompleted: () => Promise<void>;
};

export const Footer: React.FC<Props> = ({
  onStatus,
  status,
  uncompletedAmount,
  onDeleteCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${uncompletedAmount} item${uncompletedAmount > 1 ? 's' : ''}`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={cn('filter__link', { selected: status === 'All' })}
          onClick={() => onStatus('All')}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={cn('filter__link', { selected: status === 'Active' })}
          onClick={() => onStatus('Active')}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={cn('filter__link', { selected: status === 'Completed' })}
          onClick={() => onStatus('Completed')}
        >
          Completed
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        onClick={onDeleteCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
