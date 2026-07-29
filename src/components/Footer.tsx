import React from 'react';
import { Filter } from '../types/Filter';
import { TodoFilter } from './TodoFilter';

type FooterProps = {
  itemsLeft: number;
  hasCompletedTodos: boolean;
  filter: Filter;
  setFilter: React.Dispatch<React.SetStateAction<Filter>>;
  handleClearCompleted: () => void;
};

export const Footer = ({
  itemsLeft,
  hasCompletedTodos,
  filter,
  setFilter,
  handleClearCompleted,
}: FooterProps) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {itemsLeft} items left
      </span>

      <TodoFilter filter={filter} setFilter={setFilter} />

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!hasCompletedTodos}
        onClick={handleClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
