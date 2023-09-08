import classNames from 'classnames';

import React from 'react';
import { Filter } from '../../types/Enum';
import { useTodo } from '../TodoContext/TodoContext';

type Props = {
  selectedFilter: string;
  selectTheFilter: (filter: Filter) => void;
};

export const TodoFooter: React.FC<Props> = ({
  selectedFilter,
  selectTheFilter,
}) => {
  const {
    todosCompleted,
    todosUncompleted,
    deleteComplitedTodo,
  } = useTodo();

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {todosUncompleted === 1 ? (
          '1 item left'
        ) : (
          `${todosUncompleted} items left`
        )}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={classNames(
            'filter__link',
            { selected: selectedFilter === Filter.All },
          )}
          onClick={() => selectTheFilter(Filter.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames(
            'filter__link',
            { selected: selectedFilter === Filter.Active },
          )}
          onClick={() => selectTheFilter(Filter.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames(
            'filter__link',
            { selected: selectedFilter === Filter.Complited },
          )}
          onClick={() => selectTheFilter(Filter.Complited)}
        >
          Completed
        </a>
      </nav>

      {todosCompleted.length > 0 && (
        <button
          type="button"
          className="todoapp__clear-completed"
          onClick={deleteComplitedTodo}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
