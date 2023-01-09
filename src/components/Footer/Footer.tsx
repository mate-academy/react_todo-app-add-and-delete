import { useState } from 'react';
import classNames from 'classnames';

type Props = {
  left: number;
  completed: number;
  onFilter: (type: string) => void;
  onClearCompleted: ()=>void;
};

export const Footer: React.FC<Props> = ({
  left, onFilter, completed, onClearCompleted,
}) => {
  const [selectedFilter, setSelectedFilter] = useState('ALL');

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${left} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={classNames(
            'filter__link', { selected: selectedFilter === 'ALL' },
          )}
          onClick={() => {
            onFilter('ALL');
            setSelectedFilter('ALL');
          }}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={classNames(
            'filter__link', { selected: selectedFilter === 'ACTIVE' },
          )}
          onClick={() => {
            onFilter('ACTIVE');
            setSelectedFilter('ACTIVE');
          }}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={classNames(
            'filter__link', { selected: selectedFilter === 'COMPLETED' },
          )}
          onClick={() => {
            onFilter('COMPLETED');
            setSelectedFilter('COMPLETED');
          }}
        >
          Completed
        </a>
      </nav>
      <div>
        {completed !== 0 && (
          <button
            data-cy="ClearCompletedButton"
            type="button"
            className="todoapp__clear-completed"
            onClick={onClearCompleted}
          >
            Clear completed
          </button>
        )}
      </div>
    </footer>
  );
};
