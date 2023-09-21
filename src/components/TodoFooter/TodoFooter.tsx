import React from 'react';
import classNames from 'classnames';
import { Filter } from '../../types/Filter';
import { useTodo } from '../TodoContext/TodoContext';

type Props = {
  selectedFilter: Filter,
  setSelectedFilter: (filter: Filter) => void,
};

export const TodoFooter: React.FC<Props> = ({
  selectedFilter,
  setSelectedFilter,
}) => {
  const {
    todosCompleted,
    todosUncompleted,
    deleteCompletedTodo,
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

      {/* Active filter should have a 'selected' class */}
      <nav className="filter">
        <a
          href="#/"
          className={classNames(
            'filter__link',
            { selected: selectedFilter === Filter.all },
          )}
          onClick={() => setSelectedFilter(Filter.all)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames(
            'filter__link',
            { selected: selectedFilter === Filter.active },
          )}
          onClick={() => setSelectedFilter(Filter.active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames(
            'filter__link',
            { selected: selectedFilter === Filter.completed },
          )}
          onClick={() => setSelectedFilter(Filter.completed)}
        >
          Completed
        </a>
      </nav>

      {todosCompleted && (
        <button
          type="button"
          className="todoapp__clear-completed"
          onClick={deleteCompletedTodo}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
