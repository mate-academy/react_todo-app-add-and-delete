import React from 'react';
import classNames from 'classnames';
import { Todo } from '../../../type/Todo';
import { GetFilter } from '../../../type/GetFilter';

interface Props {
  todosShow: Todo[],
  filterBy: GetFilter,
  setFilterBy: (filterBy: GetFilter) => void,
  deleteTodoCompleted: () => void;
}

export const Footer: React.FC<Props> = ({
  todosShow,
  filterBy,
  setFilterBy,
  deleteTodoCompleted,
}) => {
  const todoLeft = todosShow.filter(todo => !todo.completed).length;
  const buttonClear = todosShow.filter(todo => todo.completed).length;

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${todoLeft} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={classNames(
            'filter__link',
            { selected: filterBy === GetFilter.ALL },
          )}
          onClick={() => setFilterBy(GetFilter.ALL)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames(
            'filter__link',
            { selected: filterBy === GetFilter.ACTIVE },
          )}
          onClick={() => setFilterBy(GetFilter.ACTIVE)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames(
            'filter__link',
            { selected: filterBy === GetFilter.COMPLETED },
          )}
          onClick={() => setFilterBy(GetFilter.COMPLETED)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className={classNames(
          'todoapp__clear-completed',
          { opacity: buttonClear === 0 },
        )}
        onClick={deleteTodoCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
