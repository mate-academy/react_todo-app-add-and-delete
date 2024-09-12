import React from 'react';
import { Todo } from '../types/Todo';
import { TodoStatus } from '../App';
import classNames from 'classnames';

type Props = {
  todos: Todo[];
  clearCompletedTodos: () => void;
  setFilterStatus: (filterStatus: TodoStatus) => void;
  filterStatus: TodoStatus;
};

export const Footer: React.FC<Props> = ({
  todos,
  setFilterStatus,
  filterStatus,
  clearCompletedTodos,
}) => {
  // Counts the number of uncompleted todos
  const todosCounter = todos.filter(todo => !todo.completed).length;

  return (
    /* Hide the footer if there are no todos */
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${todosCounter} ${todosCounter === 1 ? 'item' : 'items'} left`}
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          // use the selected class to highlight a selected link;
          className={classNames('filter__link', {
            selected: filterStatus === TodoStatus.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => setFilterStatus(TodoStatus.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filterStatus === TodoStatus.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => setFilterStatus(TodoStatus.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filterStatus === TodoStatus.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setFilterStatus(TodoStatus.Completed)}
        >
          Completed
        </a>
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!todos.some(todo => todo.completed)}
        onClick={clearCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
