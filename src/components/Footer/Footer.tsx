import React from 'react';
import cn from 'classnames';
import { TodoFilterOptions } from '../../types/TodoFiltersOptions';

type Props = {
  activeTodoFilter: TodoFilterOptions;
  setTodoFilterValue: React.Dispatch<React.SetStateAction<TodoFilterOptions>>;
  uncompletedTodosCount: number;
  completedTodosCount: number;
  clearCompletedTodos: () => void;
};

export const Footer: React.FC<Props> = ({
  activeTodoFilter,
  setTodoFilterValue,
  uncompletedTodosCount,
  completedTodosCount,
  clearCompletedTodos,
}) => {
  const itemLabel = uncompletedTodosCount === 1 ? 'item' : 'items';

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${uncompletedTodosCount} ${itemLabel} left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(TodoFilterOptions).map(filterOption => {
          const formattedFilterOption =
            filterOption.charAt(0).toUpperCase() + filterOption.slice(1);

          return (
            <a
              key={filterOption}
              href={`#/${filterOption.toLowerCase()}`}
              className={cn('filter__link', {
                selected: activeTodoFilter === filterOption,
              })}
              onClick={() => setTodoFilterValue(filterOption)}
              data-cy={`FilterLink${formattedFilterOption}`}
            >
              {formattedFilterOption}
            </a>
          );
        })}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={completedTodosCount === 0}
        onClick={clearCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
