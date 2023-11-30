import React from 'react';
import classNames from 'classnames';

import { Todo } from '../../types/Todo';
import { TodoFilter } from '../../types/TodoFelter';

interface Props {
  setFilter: (type: TodoFilter) => void;
  filterType: TodoFilter;
  todos: Todo[];
  cleanComplitedTodo: (todosId: number[]) => void;
}

export const Footer: React.FC<Props> = ({
  setFilter,
  todos,
  filterType,
  cleanComplitedTodo,
}) => {
  const complitedTodo = todos.filter(todo => todo.completed).length;
  const incompleteTodo = todos.length - complitedTodo;

  const handleCleanComplited = () => {
    cleanComplitedTodo(
      todos
        .filter(todo => todo.completed)
        .map(todo => todo.id),
    );
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${incompleteTodo} items left`}
      </span>

      {/* Active filter should have a 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={
            classNames(
              'filter__link',
              { selected: filterType === TodoFilter.All },
            )
          }
          data-cy="FilterLinkAll"
          onClick={() => setFilter(TodoFilter.All)}
        >
          All
        </a>
        <a
          href="#/active"
          data-cy="FilterLinkActive"
          className={
            classNames(
              'filter__link',
              { selected: filterType === TodoFilter.Active },
            )
          }
          onClick={() => setFilter(TodoFilter.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={
            classNames(
              'filter__link',
              { selected: filterType === TodoFilter.Completed },
            )
          }
          data-cy="FilterLinkCompleted"
          onClick={() => setFilter(TodoFilter.Completed)}
        >
          Completed
        </a>
      </nav>
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={() => handleCleanComplited()}
      >
        {complitedTodo > 0 && 'Clear completed'}
      </button>
    </footer>
  );
};
