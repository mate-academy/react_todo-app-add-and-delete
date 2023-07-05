import React, { memo } from 'react';
import cN from 'classnames';
import { FilterBy } from '../../utils/enums';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[],
  statusFilter: FilterBy,
  handleFilterChange: (event: React.MouseEvent) => void,
  onDeleteTodo: (todoId: number) => void
};

export const TodoFilter: React.FC<Props> = memo(
  ({
    todos,
    statusFilter,
    handleFilterChange,
    onDeleteTodo,
  }) => {
    const activeTodosNumber = todos.filter(todo => !todo.completed).length;
    const hasCompletedTodos = todos.length !== activeTodosNumber;

    const clearCompleted = () => {
      const completedTodosId = todos
        .filter(todo => todo.completed)
        .map(todo => todo.id);

      completedTodosId.forEach(onDeleteTodo);
    };

    return (
      <footer className="todoapp__footer">
        <span className="todo-count">
          {`${activeTodosNumber} items left`}
        </span>

        <nav className="filter">
          <a
            href="#/"
            className={cN('filter__link', {
              selected: statusFilter === FilterBy.All,
            })}
            onClick={handleFilterChange}
          >
            All
          </a>

          <a
            href="#/active"
            className={cN('filter__link', {
              selected: statusFilter === FilterBy.Active,
            })}
            onClick={handleFilterChange}
          >
            Active
          </a>

          <a
            href="#/completed"
            className={cN('filter__link', {
              selected: statusFilter === FilterBy.Completed,
            })}
            onClick={handleFilterChange}
          >
            Completed
          </a>
        </nav>

        <button
          type="button"
          className={cN('todoapp__clear-completed', {
            'is-invisible': !hasCompletedTodos,
          })}
          onClick={clearCompleted}
        >
          Clear completed
        </button>
      </footer>
    );
  },
);
