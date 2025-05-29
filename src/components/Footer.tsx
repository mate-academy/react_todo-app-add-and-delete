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
