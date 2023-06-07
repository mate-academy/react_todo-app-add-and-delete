import React from 'react';
import { FilterValues } from '../types/FilterValues';

type Props = {
  leftTodosCount: number,
  setFilterValue: (value: FilterValues) => void,
  handleDeletingCompletedTodos: (completedTodosID: number[]) => void,
  completedTodosID: number[]
};

export const Footer: React.FC<Props> = ({
  leftTodosCount,
  setFilterValue,
  handleDeletingCompletedTodos,
  completedTodosID,
}) => {
  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${leftTodosCount} items left`}
      </span>

      <nav className="filter">
        {
          Object.entries(FilterValues).map(([key, value]) => (
            <button
              style={{ all: 'unset' }}
              type="button"
              key={value}
              value={value}
              onClick={() => setFilterValue(value)}
            >
              <a href={`#/${value}`} className="filter__link">
                {key}
              </a>
            </button>
          ))
        }
      </nav>

      { !!completedTodosID.length && (
        <button
          type="button"
          className="todoapp__clear-completed"
          onClick={() => handleDeletingCompletedTodos(completedTodosID)}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
