import React from 'react';
import cn from 'classnames';
import { Filter } from '../types/Filter';
import { Todo } from '../types/Todo'; // Імпортуємо тип Todo, щоб уникнути помилки

type Props = {
  setFilter: (filter: Filter) => void;
  remainingCount: number;
  currentFilter: Filter;
  handleClearCompleted: () => void;
  todos: Todo[];
};

export const Footer: React.FC<Props> = ({
  handleClearCompleted,
  todos,
  setFilter,
  remainingCount,
  currentFilter,
}) => {
  const completedCount = todos.filter(todo => todo.completed).length;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {remainingCount} {remainingCount === 1 ? 'item' : 'items'} left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: currentFilter === Filter.all,
          })}
          data-cy="FilterLinkAll"
          onClick={() => setFilter(Filter.all)} // Використовуємо setFilter
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: currentFilter === Filter.active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => setFilter(Filter.active)} // Використовуємо setFilter
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: currentFilter === Filter.completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setFilter(Filter.completed)} // Використовуємо setFilter
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={handleClearCompleted}
        disabled={completedCount === 0} // Деактивуємо кнопку
      >
        Clear completed
      </button>
    </footer>
  );
};
