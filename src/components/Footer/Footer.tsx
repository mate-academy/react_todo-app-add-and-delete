import classNames from 'classnames';
import { FC } from 'react';

export type FilteringMethod = 'All' | 'Active' | 'Completed';

type Props = {
  status: FilteringMethod;
  onStatusChange: (status: FilteringMethod) => void;
  remainTodos: number;
  onClearAll: () => void;
  completedTodos: number;
};

export const Footer: FC<Props> = ({
  status,
  onStatusChange,
  remainTodos,
  onClearAll,
  completedTodos,
}) => {
  // Hide the footer if there are no todos

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${remainTodos} ${remainTodos === 1 ? 'item' : 'items'} left`}
      </span>

      {/* Active filter should have a 'selected' class */}
      <nav className="filter">
        <a
          href="#/"
          className={classNames(
            'filter__link',
            { selected: status === 'All' },
          )}
          onClick={() => onStatusChange('All')}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames(
            'filter__link',
            { selected: status === 'Active' },
          )}
          onClick={() => onStatusChange('Active')}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames(
            'filter__link',
            { selected: status === 'Completed' },
          )}
          onClick={() => onStatusChange('Completed')}
        >
          Completed
        </a>
      </nav>

      {/* don't show this button if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        onClick={onClearAll}
        style={{
          opacity: completedTodos > 0 ? 1 : 0,
          cursor: completedTodos > 0 ? 'pointer' : 'default',
        }}
      >
        Clear completed
      </button>
    </footer>
  );
};
