// import { useState } from 'react';
import classNames from 'classnames';
import { FilteredBy } from '../types/FilteredBy';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  filterBy: FilteredBy;
  onFilter: (filter: FilteredBy) => void;
  countTodos: number;
};

export const Footer: React.FC<Props> = ({
  todos, filterBy, onFilter, countTodos,
}) => {
  const handleTodoCompleted = todos.filter((todo) => todo.completed);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${countTodos} items left`}
      </span>

      {/* Active filter should have a 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filterBy === FilteredBy.ALL,
          })}
          data-cy="FilterLinkAll"
          onClick={() => onFilter(FilteredBy.ALL)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filterBy === FilteredBy.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => onFilter(FilteredBy.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filterBy === FilteredBy.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => onFilter(FilteredBy.Completed)}
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
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
