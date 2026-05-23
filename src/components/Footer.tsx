import React from 'react';
import { Todo } from '../types/Todo';
import { FilterType } from '../types/Enum';

type Props = {
  todos: Todo[];
  filter: FilterType;
  setFilter: (filter: FilterType) => void;
  onDelete: (id: number) => void;
};

export const Footer: React.FC<Props> = ({
  todos,
  filter,
  setFilter,
  onDelete,
}) => {
  const notCompletedLength = todos.filter(todo => !todo.completed).length;
  const isClearDisabled = todos.every(todo => !todo.completed);
  const hendlerClearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed === true);

    completedTodos.forEach(todo => onDelete(todo.id));
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {notCompletedLength} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(FilterType).map(filterValue => (
          <a
            key={filterValue}
            href={
              filterValue === FilterType.All
                ? '#/'
                : `#/${filterValue.toLowerCase()}`
            }
            className={`filter__link ${filter === filterValue ? 'selected' : ''}`}
            data-cy={`FilterLink${filterValue}`}
            onClick={() => setFilter(filterValue)}
          >
            {filterValue}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={isClearDisabled}
        onClick={hendlerClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
