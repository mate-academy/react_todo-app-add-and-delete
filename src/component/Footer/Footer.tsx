import React from 'react';
import classNames from 'classnames';
import { FilterBy } from '../../types/typedefs';
import { Todo } from '../../types/Todo';

interface Props {
  filterTodos: FilterBy,
  todos: Todo[],
  onSelect: (filterTodos: FilterBy) => void;
  onDeleteCompleted: () => void;
}

export const Footer: React.FC<Props> = ({
  filterTodos,
  todos,
  onSelect: handleFilterTodos,
  onDeleteCompleted: handleDeleteCompletedTodo,
}) => {
  const completedTodos = todos.filter(todo => !todo.completed);

  return (
    todos.length > 0 ? (
      <footer className="todoapp__footer">
        <span className="todo-count">
          {`${completedTodos.length} items left`}
        </span>

        <nav className="filter">
          <a
            href="#/"
            className={classNames('filter__link', {
              selected: filterTodos === FilterBy.ALL,
            })}
            onClick={() => handleFilterTodos(FilterBy.ALL)}
          >
            All
          </a>

          <a
            href="#/active"
            className={classNames('filter__link', {
              selected: filterTodos === FilterBy.ACTIVE,
            })}
            onClick={() => handleFilterTodos(FilterBy.ACTIVE)}
          >
            Active
          </a>

          <a
            href="#/completed"
            className={classNames('filter__link', {
              selected: filterTodos === FilterBy.COMPLETED,
            })}
            onClick={() => handleFilterTodos(FilterBy.COMPLETED)}
          >
            Completed
          </a>
        </nav>

        <button
          type="button"
          className="todoapp__clear-completed"
          onClick={() => handleDeleteCompletedTodo()}
        >
          Clear completed
        </button>

      </footer>
    )
      : (<></>)
  );
};
