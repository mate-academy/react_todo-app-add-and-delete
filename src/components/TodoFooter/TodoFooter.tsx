import classNames from 'classnames';
import React from 'react';
import { Filter } from '../../types/Todo';

type Props = {
  countTodoActive: number;
  countTodoCompleted: number;
  filterStatus: Filter;
  setFilterStatus: React.Dispatch<React.SetStateAction<Filter>>;
  deleteCompletedTodos: () => void;
};

export const TodoFooter: React.FC<Props> = ({
  countTodoActive,
  filterStatus,
  setFilterStatus,
  deleteCompletedTodos,
  countTodoCompleted,
}) => (
  <footer className="todoapp__footer">
    <span className="todo-count">
      {countTodoActive}
      {' '}
      items left
    </span>

    <nav className="filter">
      <a
        href="#/"
        className={classNames(
          'filter__link',
          { selected: filterStatus === Filter.ALL },
        )}
        onClick={() => setFilterStatus(Filter.ALL)}
      >
        All
      </a>

      <a
        href="#/active"
        className={classNames(
          'filter__link',
          { selected: filterStatus === Filter.ACTIVE },
        )}
        onClick={() => setFilterStatus(Filter.ACTIVE)}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={classNames(
          'filter__link',
          { selected: filterStatus === Filter.COMPLETED },
        )}
        onClick={() => setFilterStatus(Filter.COMPLETED)}
      >
        Completed
      </a>
    </nav>

    {countTodoCompleted > 0 && (
      <button
        type="button"
        className="todoapp__clear-completed"
        onClick={() => deleteCompletedTodos()}
      >
        Clear completed
      </button>
    )}
  </footer>
);
