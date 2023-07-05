/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import classNames from 'classnames';
import { FilterStatus } from '../../helper';
import { Todo } from '../../types/Todo';

interface Props {
  activeTodosQuantity: number;
  filterStatuses: string[];
  filter: string;
  handleFilterChange: (arg: FilterStatus) => void
  initialTodos: Todo[]
  removeTodo: (arg: number) => void;
}

export const ContentFooter: React.FC<Props> = ({
  activeTodosQuantity,
  filterStatuses,
  filter,
  handleFilterChange,
  initialTodos,
  removeTodo,
}) => {
  const completedTodo = initialTodos.filter(todo => todo.completed);

  const removeCompletedTodos = () => {
    completedTodo.map(todo => removeTodo(todo.id));
  };

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${activeTodosQuantity} items left`}
      </span>

      {/* Active filter should have a 'selected' class */}
      <nav className="filter">
        {filterStatuses.map((status) => (
          <a
            href="#/"
            className={classNames('filter__link', {
              selected: filter === status,
            })}
            onClick={() => handleFilterChange(status as FilterStatus)}
          >
            {status[0].toUpperCase() + status.slice(1)}
          </a>
        ))}
      </nav>

      {/* don't show this button if there are no completed todos */}
      <button
        type="button"
        className={classNames('todoapp__clear-completed', {
          'is-invisible': completedTodo.length === 0,
        })}
        onClick={removeCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
