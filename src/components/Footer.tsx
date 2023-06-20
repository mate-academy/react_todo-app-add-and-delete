import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { Filter } from '../types/Filter';

interface Props {
  todos: Todo[];
  filter: Filter;
  setFilter: (filter: Filter) => void;
  onClearCompleted: () => void;
  // tempTodo: Todo | null;
  // isLoading: boolean;
}

export const Footer: React.FC<Props> = ({
  todos,
  filter,
  setFilter,
  onClearCompleted,
  // tempTodo,
  // isLoading,
}) => {
  const incompleteTodoCount = todos.filter(todo => !todo.completed);

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${incompleteTodoCount.length} items left`}
      </span>

      {/* Active filter should have a 'selected' class */}
      <nav className="filter">
        <a
          href="#/"
          className={classNames(
            'filter__link',
            { selected: filter === Filter.ALL },
          )}
          onClick={() => setFilter(Filter.ALL)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames(
            'filter__link',
            { selected: filter === Filter.ACTIVE },
          )}
          onClick={() => setFilter(Filter.ACTIVE)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames(
            'filter__link',
            { selected: filter === Filter.COMPLETED },
          )}
          onClick={() => setFilter(Filter.COMPLETED)}
        >
          Completed
        </a>
      </nav>

      {/* don't show this button if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
