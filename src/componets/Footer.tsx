import React from 'react';
import cn from 'classnames';
import { Category } from '../types/Category';
import { Todo } from '../types/Todo';
const filters = [
  { label: 'All', value: Category.All },
  { label: 'Active', value: Category.Active },
  { label: 'Completed', value: Category.Completed },
];

type Props = {
  todos: Todo[];
  activeTodosCount: number;
  category: Category;
  setCategory: (value: Category) => void;
  removeElementAllCompleted: () => void;
};
export const Footer: React.FC<Props> = ({
  todos,
  activeTodosCount,
  category,
  setCategory,
  removeElementAllCompleted,
}) => {
  return (
    todos.length > 0 && (
      <footer className="todoapp__footer" data-cy="Footer">
        <span className="todo-count " data-cy="TodosCounter">
          {activeTodosCount} items left
        </span>

        {/* Active link should have the 'selected' class */}
        <nav className="filter" data-cy="Filter">
          {filters.map(filter => (
            <a
              href="#/"
              className={cn('filter__link', {
                selected: category === filter.value,
              })}
              key={filter.label}
              data-cy={`FilterLink${filter.label}`}
              onClick={() => setCategory(filter.value)}
            >
              {filter.label}
            </a>
          ))}
        </nav>

        {/* this button should be disabled if there are no completed todos */}
        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
          onClick={removeElementAllCompleted}
          disabled={activeTodosCount === todos.length}
        >
          Clear completed
        </button>
      </footer>
    )
  );
};
