import React from 'react';
import cn from 'classnames';
import { Filter } from '../../types/Filter';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  filterBy: Filter;
  onFilterClick: (value: Filter) => void;
};

export const TodoFilter: React.FC<Props> = ({
  todos,
  filterBy,
  onFilterClick,
}) => {
  const filterLinks = Object.values(Filter).map((filter) => (
    <a
      key={filter}
      href={`#/${filter.toLowerCase()}`}
      className={cn('filter__link', { selected: filter === filterBy })}
      data-cy={`FilterLink${filter}`}
      onClick={() => onFilterClick(filter)}
    >
      {filter}
    </a>
  ));

  const activeTodosCount = todos.filter((todo) => !todo.completed).length;
  const completedTodosCount = todos.filter((todo) => todo.completed).length;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeTodosCount} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {filterLinks}
      </nav>

      {/* don't show this button if there are no completed todos */}
      {completedTodosCount !== 0 && (
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
