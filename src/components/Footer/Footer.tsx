import React from 'react';
import classNames from 'classnames';
import { Filter } from '../../types/Filter';

type Props = {
  setFilterBy: (filterBy:Filter) => void;
  filter: Filter;
  todosLeft: number;
  deleteTodoCompleted: () => void;
};

export const Footer:React.FC<Props> = ({
  setFilterBy,
  filter,
  todosLeft,
  deleteTodoCompleted,
}) => {
  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {todosLeft === 1 ? '1 item left' : `${todosLeft} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={classNames(
            'filter__link',
            { selected: filter === 'all' },
          )}
          onClick={() => setFilterBy(Filter.ALL)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames(
            'filter__link',
            { selected: filter === 'active' },
          )}
          onClick={() => setFilterBy(Filter.ACTIVE)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames(
            'filter__link',
            { selected: filter === 'completed' },
          )}
          onClick={() => setFilterBy(Filter.COMPLETED)}
        >
          Completed
        </a>
      </nav>

      {todosLeft > 0 && (
        <button
          type="button"
          className="todoapp__clear-completed"
          onClick={deleteTodoCompleted}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
