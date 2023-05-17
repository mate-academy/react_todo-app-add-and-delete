import { FC } from 'react';
import cn from 'classnames';
import { Filter } from '../../types/Filter';

interface Props {
  activeTodos: number,
  filter: string,
  completedTodos: number,
  setFilter: (filter: Filter) => void,
}

export const Footer: FC<Props> = ({
  activeTodos,
  filter,
  completedTodos,
  setFilter,
}) => {
  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${activeTodos} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: filter === 'all',
          })}
          onClick={() => setFilter(Filter.ALL)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link',
            { selected: filter === 'active' })}
          onClick={() => setFilter(Filter.ACTIVE)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link',
            { selected: filter === 'completed' })}
          onClick={() => setFilter(Filter.COMPLETED)}
        >
          Completed
        </a>
      </nav>

      {/* don't show this button if there are no completed todos */}
      <button
        type="button"
        className={cn('todoapp__clear-completed',
          { hidden: !completedTodos })}
      >
        Clear completed
      </button>
    </footer>
  );
};
