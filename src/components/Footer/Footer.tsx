import React, { useMemo } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { FilterType } from '../../types/FilterType';
import { completedTodos } from '../../utils/CompletedTodos';

type Props = {
  todos: Todo[]
  filterType: FilterType,
  setFilterType: React.Dispatch<React.SetStateAction<FilterType>>,
  removeCompleted: () => void,
};

export const Footer: React.FC<Props> = React.memo(
  ({
    todos,
    filterType,
    setFilterType,
    removeCompleted,
  }) => {
    const listOfUncompletedTodos = useMemo(() => {
      return todos.filter(todo => !todo.completed);
    }, [todos]);

    const listOfCompletedTodos = completedTodos(todos);

    return (
      <footer className="todoapp__footer">
        <span className="todo-count">
          {`${listOfUncompletedTodos.length} items left`}
        </span>

        <nav className="filter centered">
          <a
            href="#/"
            className={classNames('filter__link', {
              'filter__link selected': filterType === FilterType.ALL,
            })}
            onClick={() => setFilterType(FilterType.ALL)}
          >
            All
          </a>

          <a
            href="#/active"
            className={classNames('filter__link', {
              'filter__link selected': filterType === FilterType.ACTIVE,
            })}
            onClick={() => setFilterType(FilterType.ACTIVE)}
          >
            Active
          </a>

          <a
            href="#/completed"
            className={classNames('filter__link', {
              'filter__link selected': filterType === FilterType.COMPLETED,
            })}
            onClick={() => setFilterType(FilterType.COMPLETED)}
          >
            Completed
          </a>
        </nav>

        <button
          type="button"
          className="todoapp__clear-completed"
          disabled={listOfCompletedTodos.length === 0}
          onClick={removeCompleted}
        >
          Clear completed
        </button>
      </footer>
    );
  },
);
