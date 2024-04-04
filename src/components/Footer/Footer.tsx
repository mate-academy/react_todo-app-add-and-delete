import React from 'react';
import { FilterBy } from '../../types/FilterBy';
import { Todo } from '../../types/Todo';
import cn from 'classnames';

type Props = {
  onFilterByClick: (filterByValue: FilterBy) => void;
  todos: Todo[];
  filterBy: FilterBy;
  onCompletedTodoDelete: () => void;
};

export const Footer: React.FC<Props> = ({
  onFilterByClick,
  todos,
  filterBy,
  onCompletedTodoDelete,
}) => {
  const activeTodosCount = todos.filter(todo => !todo.completed).length;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.entries(FilterBy).map(([property, value]) => (
          <a
            key={property}
            href={`#/${value}`}
            className={cn('filter__link', {
              selected: filterBy === value,
            })}
            data-cy={`FilterLink${property}`}
            onClick={() => onFilterByClick(value)}
          >
            {property}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        disabled={todos.every(todo => !todo.completed)}
        data-cy="ClearCompletedButton"
        onClick={() => onCompletedTodoDelete()}
      >
        Clear completed
      </button>
    </footer>
  );
};
