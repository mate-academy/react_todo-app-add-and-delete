import React from 'react';
import { Todo } from '../types/Todo';
import { FilterType } from '../types/FilterType';

interface FooterProps {
  todos: Todo[];
  activeFilter: FilterType;
  setActiveFilter: React.Dispatch<React.SetStateAction<FilterType>>;
  handleClearCompleted: () => void;
}

const Footer: React.FC<FooterProps> = ({
  todos,
  activeFilter,
  setActiveFilter,
  handleClearCompleted,
}) => {
  if (todos.length === 0) {
    return null;
  }

  const notCompletedCount = todos.filter(todo => !todo.completed).length;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {notCompletedCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(FilterType).map(filter => (
          <a
            key={filter}
            href={`#/${filter.toLowerCase()}`}
            className={`filter__link ${activeFilter === filter ? 'selected' : ''}`}
            data-cy={`FilterLink${filter}`}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={handleClearCompleted}
        disabled={!todos.some(todo => todo.completed)}
      >
        Clear Completed
      </button>
    </footer>
  );
};

export default Footer;
