import React from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { TodoFilter } from '../../types/TodoFilter';

type Props = {
  todos: Todo[],
  filter: TodoFilter,
  onFilter: (filter: TodoFilter) => void,
  clearCompletedTodos: () => void,
};

export const Footer: React.FC<Props> = ({
  todos,
  filter,
  onFilter,
  clearCompletedTodos,
}) => {
  const handleTodoCompleted = todos.filter(todo => todo.completed);
  const handleCountActiveTodos = todos
    .filter(todo => !todo.completed).length;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${handleCountActiveTodos} items left`}
      </span>

      {/* Active filter should have a 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filter === TodoFilter.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => onFilter(TodoFilter.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filter === TodoFilter.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => onFilter(TodoFilter.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filter === TodoFilter.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => onFilter(TodoFilter.Completed)}
        >
          Completed
        </a>
      </nav>

      {/* don't show this button if there are no completed todos */}
      {handleTodoCompleted.length && (
        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
          onClick={clearCompletedTodos}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
