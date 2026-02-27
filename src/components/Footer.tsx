import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { Filter } from '../types/enums';

interface Props {
  todosLeft: number;
  filterSelected: Filter;
  setFilterSelected: React.Dispatch<React.SetStateAction<Filter>>;
  todos: Todo[];
  handleDelete: (todoId: number) => void;
}

export const Footer: React.FC<Props> = ({
  todosLeft,
  filterSelected,
  setFilterSelected,
  todos,
  handleDelete,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todosLeft} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filterSelected === Filter.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => setFilterSelected(Filter.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filterSelected === Filter.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => setFilterSelected(Filter.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filterSelected === Filter.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setFilterSelected(Filter.Completed)}
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
        onClick={() => {
          const completedTodos = todos.filter(todo => todo.completed);

          completedTodos.forEach(todo => {
            handleDelete(todo.id);
          });
        }}
      >
        Clear completed
      </button>
    </footer>
  );
};
