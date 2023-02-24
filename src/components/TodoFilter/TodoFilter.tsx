import classNames from 'classnames';
import React from 'react';
import { Filter } from '../../enums/Filter';
import { Todo } from '../../types/Todo';

type Props = {
  filter: Filter,
  setFilter: (value: Filter) => void;
  onClear: () => void;
  todos: Todo[];
};

export const TodoFilter: React.FC<Props> = React.memo(
  ({
    filter, setFilter, onClear, todos,
  }) => {
    const isAnyTodoCompleted = todos.some(todo => todo.completed);
    const quantityCompletedTodos = [...todos]
      .filter(todo => todo.completed).length;

    return (
      <>
        <span className="todo-count">
          {`${todos.length - quantityCompletedTodos} items left`}
        </span>

        <nav className="filter">
          <a
            href="#/"
            className={classNames('filter__link',
              { selected: filter === Filter.ALL })}
            onClick={() => setFilter(Filter.ALL)}
          >
            All
          </a>

          <a
            href="#/active"
            className={classNames('filter__link',
              { selected: filter === Filter.ACTIVE })}
            onClick={() => setFilter(Filter.ACTIVE)}
          >
            Active
          </a>

          <a
            href="#/completed"
            className={classNames('filter__link',
              { selected: filter === Filter.COMPLETED })}
            onClick={() => setFilter(Filter.COMPLETED)}
          >
            Completed
          </a>
        </nav>

        <button
          type="button"
          className="todoapp__clear-completed"
          onClick={() => onClear()}
          disabled={!isAnyTodoCompleted}
          style={{ opacity: isAnyTodoCompleted ? 1 : 0 }}
        >
          Clear completed
        </button>

      </>
    );
  },
);
