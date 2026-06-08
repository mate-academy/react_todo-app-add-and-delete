import React from 'react';
import { Todo } from '../types/Todo';
import { FilterType } from '../types/FilterType';

interface Props {
  todos: Todo[];
  filterBy: FilterType;
  setFilterBy: (val: FilterType) => void;
  handleClearCompleted: () => void;
}

export const TodoFooter: React.FC<Props> = ({
  todos,
  filterBy,
  setFilterBy,
  handleClearCompleted,
}) => {
  const filterOptions = [
    FilterType.All,
    FilterType.Active,
    FilterType.Completed,
  ];

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todos.filter(todo => !todo.completed).length} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {filterOptions.map(filter => (
          <a
            key={filter}
            href={
              filter === FilterType.All ? '#/' : `#/${filter.toLowerCase()}`
            }
            className={`filter__link ${filterBy === filter ? 'selected' : ''}`}
            data-cy={`FilterLink${filter}`}
            onClick={() => setFilterBy(filter)}
          >
            {filter}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={todos.filter(todo => todo.completed).length === 0}
        onClick={handleClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
