import React from 'react';
import { useTodoContext } from '../../context/TodosProvider';
import { Filter } from '../Filter/Filter';

const FILTER_VALUES = ['All', 'Active', 'Completed'];

export const Footer: React.FC = () => {
  const { filteredTodos, handleClearCompleted } = useTodoContext();
  const isActive = filteredTodos.some(todo => todo.completed);
  const countOfActiveTodos = filteredTodos.reduce((acc, curr) => {
    return acc + +(!curr.completed);
  }, 0);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${countOfActiveTodos} items left`}
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
        onClick={handleClearCompleted}
        disabled={!isActive}
      >
        Clear completed
      </button>
    </footer>
  );
};
