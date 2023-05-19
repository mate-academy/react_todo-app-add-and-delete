import { FC } from 'react';
import cn from 'classnames';
import { Filter } from '../../types/Filter';
import { Todo } from '../../types/Todo';

interface Props {
  todos: Todo[],
  activeTodos: number,
  filter: Filter,
  completedTodos: number,
  setFilter: (filter: Filter) => void,
}

export const Footer: FC<Props> = ({
  todos,
  activeTodos,
  filter,
  completedTodos,
  setFilter,
}) => {
  return (
    <footer className={cn('todoapp__footer', {
      hidden: todos.length === 0,
    })}
    >
      <span className="todo-count">
        {`${activeTodos} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: filter === Filter.ALL,
          })}
          onClick={() => setFilter(Filter.ALL)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link',
            { selected: filter === Filter.ACTIVE })}
          onClick={() => setFilter(Filter.ACTIVE)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link',
            { selected: filter === Filter.COMPLETED })}
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
