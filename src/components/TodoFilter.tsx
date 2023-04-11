import { FC } from 'react';
import classNames from 'classnames';
import { StatusToFilterBy, Todo } from '../types/Todo';

interface Props {
  filterBy: StatusToFilterBy,
  setFilterBy: (status: StatusToFilterBy) => void;
  itemsLeft: number;
  todos: Todo[];
  deleteComplete: () => void;
}

export const TodoFilter: FC<Props> = ({
  filterBy,
  setFilterBy,
  itemsLeft,
  todos,
  deleteComplete,
}) => {
  const filterByLink = Object.entries(StatusToFilterBy);

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${itemsLeft} items left`}
      </span>

      {/* Active filter should have a 'selected' class */}
      <nav className="filter">
        {filterByLink.map(([label, value]) => {
          return (
            <a
              href="#/"
              className={classNames('filter__link', {
                selected: filterBy === label,
              })}
              key={value}
              onClick={() => setFilterBy(value)}
            >
              {label}
            </a>
          );
        })}
      </nav>

      {itemsLeft !== todos.length && (
        <button
          type="button"
          className="todoapp__clear-completed"
          onClick={() => deleteComplete()}
        >
          Clear completed
        </button>
      )}

    </footer>
  );
};
