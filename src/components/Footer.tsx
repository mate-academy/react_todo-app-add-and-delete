import React from 'react';

import { Filters, Todo } from '../types/Todo';
import FilterButton from './FilterButton';

type Props = {
  todos: Todo[];
  activeFilter: Filters;
  setActiveFilter: (filter: Filters) => void;
  handleClearCompleted: () => void;
};

const Footer: React.FC<Props> = ({
  todos,
  activeFilter,
  setActiveFilter,
  handleClearCompleted,
}) => {
  const activeTodos = todos.filter(todo => !todo.completed);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodos.length} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(Filters).map(filterItem => (
          <FilterButton
            key={filterItem}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            filterItem={filterItem}
          />
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={todos.every(todo => !todo.completed)}
        onClick={handleClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};

export default Footer;
