import React from 'react';
import { useTodoContext } from '../../context/TodosProvider';
import { Filter } from '../Filter/Filter';

const FILTER_VALUES = ['All', 'Active', 'Completed'];

export const Footer: React.FC = () => {
  const { filteredTodos } = useTodoContext();

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${filteredTodos.length} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {FILTER_VALUES.map(filter => (
          <Filter filter={filter} key={filter} />
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
      >
        Clear completed
      </button>
    </footer>
  );
};
