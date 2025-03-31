import classNames from 'classnames';
import React from 'react';
import { FilteredBy } from '../../types/filteredBy';
import { Todo } from '../../types/Todo';

interface Props {
  todos: Todo[];
  filteredBy: string;
  setFilteredBy: (param: FilteredBy) => void;
  handleDelete: (id: number) => void;
}

export const FooterTodo: React.FC<Props> = ({
  todos,
  filteredBy,
  setFilteredBy,
  handleDelete,
}: Props) => {
  const countActiveTodos = todos.filter(todo => !todo.completed).length;
  const hasTodosCompleted = todos.some(todo => todo.completed === true);

  const deleteCompleted = () => {
    todos.filter(todo => todo.completed).forEach(todo => handleDelete(todo.id));
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {countActiveTodos} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filteredBy === 'All',
          })}
          data-cy="FilterLinkAll"
          onClick={() => setFilteredBy(FilteredBy.ALL)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filteredBy === 'Active',
          })}
          data-cy="FilterLinkActive"
          onClick={() => setFilteredBy(FilteredBy.ACTIVE)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filteredBy === 'Completed',
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setFilteredBy(FilteredBy.COMPLETED)}
        >
          Completed
        </a>
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!hasTodosCompleted}
        onClick={deleteCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
