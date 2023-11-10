import React from 'react';
import cn from 'classnames';
import { Filter } from '../../types/Filter';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  onClearButtonDelete: () => Promise<void>;
  filterBy: Filter;
  onFilterClick: (value: Filter) => void;
};

export const TodoFilter: React.FC<Props> = ({
  todos,
  onClearButtonDelete,
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
  const isCompletedTodos = todos.some((todo) => todo.completed);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosCount === 1 ? (
          `${activeTodosCount} item left`
        ) : (
          `${activeTodosCount} items left`
        )}
      </span>

      <nav className="filter" data-cy="Filter">
        {filterLinks}
      </nav>

      <button
        type="button"
        className={cn('todoapp__clear-completed', {
          hidden: !isCompletedTodos,
        })}
        data-cy="ClearCompletedButton"
        onClick={onClearButtonDelete}
        disabled={!isCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
