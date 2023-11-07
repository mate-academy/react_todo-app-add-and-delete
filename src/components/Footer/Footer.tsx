import React, { useState } from 'react';
import { Filter } from '../../types/Filter';
import { Todo } from '../../types/Todo';

type Props = {
  fullTodos: Todo[],
  // todos: Todo [],
  setFilter: (value: Filter) => void,
};

export const Footer: React.FC<Props> = ({ fullTodos, setFilter }) => {
  const [selectedFilter, setSelectedFilter] = useState(Filter.All);

  const filters = Object.values(Filter).map((filter) => ({
    filter,
    label: filter.charAt(0).toUpperCase() + filter.slice(1),
  }));

  const handleFilterClick = (filter: Filter) => {
    setSelectedFilter(filter);
    setFilter(filter);
  };

  const completedTodoCount = fullTodos.filter(todo => !todo.completed).length;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${completedTodoCount} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {filters.map(({ filter, label }) => (
          <a
            key={filter}
            href={filter === Filter.All ? '#/' : `#/${filter.toLowerCase()}`}
            className={`filter__link ${selectedFilter === filter ? 'selected' : ''}`}
            data-cy={`FilterLink${label}`}
            onClick={() => handleFilterClick(filter)}
          >
            {label}
          </a>
        ))}
      </nav>
      {/* don't show this button if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={() => setFilter(Filter.All)}
      >
        Clear completed
      </button>
    </footer>
  );
};
