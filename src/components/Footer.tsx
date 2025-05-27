import React from 'react';
import { Filter } from '../App';

type Props = {
  activeTodos: number;
  selectedFilter: string;
  setSelectedFilter: React.Dispatch<React.SetStateAction<Filter>>;
  completedTodos: number;
  handleClearCompleted: () => Promise<void>;
};

export const Footer: React.FC<Props> = ({
  activeTodos,
  selectedFilter,
  setSelectedFilter,
  completedTodos,
  handleClearCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodos} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        {Object.values(Filter).map((filter, index) => (
          <a
            key={index}
            href={`#/${filter}`}
            className={`filter__link ${selectedFilter === filter ? 'selected' : ''}`}
            data-cy={`FilterLink${filter}`}
            onClick={() => setSelectedFilter(filter)}
          >
            {filter}
          </a>
        ))}
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={completedTodos === 0}
        onClick={handleClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
