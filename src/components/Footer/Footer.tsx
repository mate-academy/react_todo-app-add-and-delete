import classNames from 'classnames';

import { Todo } from '../../types/Todo';
import { Filter } from '../../App';

type FooterProps = {
  itemsLeft: number;
  sortBy: string;
  onSortBy: (sort: string) => void;
  todos: Todo[];
  onCleanCompleted: () => void;
};

export function Footer({
  itemsLeft,
  sortBy,
  onSortBy,
  todos,
  onCleanCompleted,
}: FooterProps) {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {itemsLeft} items left
      </span>
      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        {Object.values(Filter).map(filter => (
          <a
            key={filter}
            href={`#/${filter}`}
            className={classNames('filter__link', {
              selected: sortBy === filter,
            })}
            data-cy={`FilterLink${filter.charAt(0).toUpperCase() + filter.slice(1)}`}
            onClick={e => {
              e.preventDefault();
              onSortBy(filter);
            }}
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
          </a>
        ))}
      </nav>
      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={todos.length !== itemsLeft ? false : true}
        onClick={onCleanCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
}
