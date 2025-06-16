import React from 'react';
import { Todo } from '../../types/Todo';
import { StatusTodos } from '../../types/StatusTodos';
import classNames from 'classnames';

interface FooterProps {
  todos: Todo[];
  selectStatusTodos: StatusTodos;
  onChangeStatusTodos: (selectStatusTodos: StatusTodos) => void;
  onDeleteCompleted: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  todos,
  selectStatusTodos,
  onChangeStatusTodos,
  onDeleteCompleted,
}) => {
  const itemsLeft = todos.filter(todo => !todo.completed).length;
  const isDisabled = todos.every(todo => !todo.completed);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {itemsLeft} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: selectStatusTodos === StatusTodos.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => onChangeStatusTodos(StatusTodos.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: selectStatusTodos === StatusTodos.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => onChangeStatusTodos(StatusTodos.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: selectStatusTodos === StatusTodos.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => onChangeStatusTodos(StatusTodos.Completed)}
        >
          Completed
        </a>
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={onDeleteCompleted}
        disabled={isDisabled}
      >
        Clear completed
      </button>
    </footer>
  );
};
