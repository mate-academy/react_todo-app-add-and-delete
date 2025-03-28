import React from 'react';
import { Todo } from '../types/Todo';
import { FilterBy } from '../types/FilterBy';
import classNames from 'classnames';

type Props = {
  todos: Todo[];
  filterBy: string;
  setFilterBy: (value: FilterBy) => void;
  deleteTodo: (value: number) => void;
};

export const Footer: React.FC<Props> = ({
  todos,
  filterBy,
  setFilterBy,
  deleteTodo,
}) => {
  const completedTodos = todos
    .filter(todo => todo.completed)
    .map(todo => todo.id);

  const amountOfActiveTodo = todos.length - completedTodos.length;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {amountOfActiveTodo} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        {Object.entries(FilterBy).map(([filterKey, filterValue]) => (
          <a
            key={filterKey}
            href={`#/${filterValue}`}
            className={classNames('filter__link', {
              selected: filterBy === filterValue,
            })}
            data-cy={`FilterLink${filterKey}`}
            onClick={() => setFilterBy(filterValue)}
          >
            {filterKey}
          </a>
        ))}
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={completedTodos.length === 0}
        onClick={() => {
          completedTodos.forEach(deleteTodo);
        }}
      >
        Clear completed
      </button>
    </footer>
  );
};
