import React from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { FilterOption } from '../../types/FilterOption';

interface Props {
  todos: Todo[];
  filter: string;
  setFilter: (filter: FilterOption) => void;
}

export const Footer: React.FC<Props> = ({
  todos,
  filter,
  setFilter,
}) => {
  const completedTodos = todos.filter((todo) => todo.completed);
  const hasCompletedTodo = completedTodos.length > 0;

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">{`${todos.length - completedTodos.length} items left`}</span>

      <nav className="filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: filter === FilterOption.All,
          })}
          onClick={() => setFilter(FilterOption.All)}
        >
          {FilterOption.All}
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: filter === FilterOption.Active,
          })}
          onClick={() => setFilter(FilterOption.Active)}
        >
          {FilterOption.Active}
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: filter === FilterOption.Completed,
          })}
          onClick={() => setFilter(FilterOption.Completed)}
        >
          {FilterOption.Completed}
        </a>
      </nav>

      {hasCompletedTodo && (
        <button type="button" className="todoapp__clear-completed">
          Clear completed
        </button>
      )}
    </footer>
  );
};
