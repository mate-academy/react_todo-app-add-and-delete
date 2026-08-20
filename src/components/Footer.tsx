import React from 'react';
import { Selected } from '../types/Selected';
import { Filter } from '../types/Filter';

type Props = {
  selectedFilterLink: Selected;
  setSelectedFilterLink: (parametr: Selected) => void;
  todosCounter: number;
  hasCompletedTodos: boolean;
  clearCompleted: () => void;
  filters: Filter[];
};

export const Footer: React.FC<Props> = ({
  selectedFilterLink,
  setSelectedFilterLink,
  todosCounter,
  hasCompletedTodos,
  clearCompleted,
  filters,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${todosCounter} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {filters.map(filter => (
          <a
            key={filter.value}
            href={filter.href}
            className={`filter__link ${
              selectedFilterLink === filter.value ? 'selected' : ''
            }`}
            data-cy={`FilterLink${filter.dataCy}`}
            onClick={() => {
              setSelectedFilterLink(filter.value);
            }}
          >
            {filter.title}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={clearCompleted}
        disabled={!hasCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
