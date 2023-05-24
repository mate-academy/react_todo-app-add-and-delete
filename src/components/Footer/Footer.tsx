import React from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { FilterOption } from '../../types/FilterOption';

interface Props {
  todos: Todo[];
  filter: string;
  setFilter: (filter: FilterOption) => void;
}

export const Footer: React.FC<Props> = ({ todos, filter, setFilter }) => {
  const completedTodos = todos.filter((todo) => todo.completed);
  const hasCompletedTodo = todos.find((todo) => todo.completed);

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">{`${completedTodos.length} items left`}</span>

      <nav className="filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: filter === FilterOption.ALL,
          })}
          onClick={() => setFilter(FilterOption.ALL)}
        >
          {FilterOption.ALL}
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: filter === FilterOption.ACTIVE,
          })}
          onClick={() => setFilter(FilterOption.ACTIVE)}
        >
          {FilterOption.ACTIVE}
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: filter === FilterOption.COMPLETED,
          })}
          onClick={() => setFilter(FilterOption.COMPLETED)}
        >
          {FilterOption.COMPLETED}
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
