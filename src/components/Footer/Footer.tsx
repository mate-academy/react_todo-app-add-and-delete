import React from 'react';
import classNames from 'classnames';
import { Filterby, Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  filterBy: Filterby;
  setFilterBy: (value: Filterby) => void;
  deleteComplited: () => void;
};

export const Footer: React.FC<Props> = ({
  todos,
  filterBy,
  setFilterBy,
  deleteComplited,
}) => {
  const amountOfActiveTodo = todos.filter(todo => !todo.completed).length;
  const hasCompletedTodo = todos.some(todo => todo.completed === true);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {amountOfActiveTodo} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        {Object.values(Filterby).map(filterValue => (
          <a
            key={filterValue}
            href={`#/${filterValue}`}
            className={classNames('filter__link', {
              selected: filterBy === filterValue,
            })}
            data-cy={`FilterLink${filterValue}`}
            onClick={() => setFilterBy(filterValue)}
          >
            {filterValue}
          </a>
        ))}
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!hasCompletedTodo}
        onClick={deleteComplited}
      >
        Clear completed
      </button>
    </footer>
  );
};
