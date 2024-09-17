import classNames from 'classnames';
import React from 'react';
import { StatusFilterValue } from '../../types/Todo';
import { Todo } from '../../types/Todo';
import { useTodos } from '../../utils/hooks';

type Props = {
  todos: Todo[];
  setStatusFilter: (value: StatusFilterValue) => void;
  statusFilter: StatusFilterValue;
};

export const Footer: React.FC<Props> = ({
  todos,
  setStatusFilter,
  statusFilter,
}) => {
  const { handleDeleteTodo } = useTodos();
  const activeTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  const handleClearCompletedTodos = () => {
    completedTodos.forEach(todo => handleDeleteTodo(todo));
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodos.length} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(StatusFilterValue).map(value => {
          const label = `${value[0].toUpperCase()}${value.slice(1)}`;

          return (
            <a
              key={value}
              href="#/"
              onClick={e => {
                e.preventDefault();
                setStatusFilter(value);
              }}
              className={classNames('filter__link', {
                selected: statusFilter === value,
              })}
              data-cy={`FilterLink${label}`}
            >
              {label}
            </a>
          );
        })}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!completedTodos.length}
        onClick={handleClearCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
