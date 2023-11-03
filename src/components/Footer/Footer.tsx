import React from 'react';
import { Todo } from '../../types/Todo';
import { FilterTypes } from '../../types/TodoFilter';

type Props = {
  todos: Todo[],
  clearCompletedTodos: () => void,
  selectedFilter: string,
  onSelectedFilter: (val: FilterTypes) => void,
};

export const TodoFilter: React.FC<Props> = ({
  todos,
  clearCompletedTodos,
  selectedFilter,
  onSelectedFilter,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${todos.filter(({ completed }) => !completed).length} items left`}
      </span>

      <nav className="filter" data-cy="Filter">

        {Object.values(FilterTypes).map((filterType:FilterTypes) => (
          <a
            key={`filter_${filterType}`}
            data-cy={`FilterLink${filterType}`}
            href="#/"
            className={`filter__link ${selectedFilter === filterType ? 'selected' : ''}`}
            onClick={() => onSelectedFilter(filterType)}
          >
            {filterType}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={clearCompletedTodos}
        disabled={!todos.some(({ completed }) => completed)}
      >
        Clear completed
      </button>

    </footer>
  );
};
