import React, { useContext } from 'react';
import { TodoContext } from '../context/todoContext';
import { SORT } from '../types/Sort';

export const TodoFooter: React.FC = () => {
  const {
    todos,
    countItemsLeft,
    resetCompleted,
    countItemsCompleted,
    currentFilter,
    setCurrentFilter,
  } = useContext(TodoContext);

  const hasTodos = todos.length > 0;
  const completedItemsCount = countItemsCompleted();

  if (!hasTodos && currentFilter === SORT.ALL) {
    return null;
  }

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">{`${countItemsLeft()} items left`}</span>

      <nav className="filter">
        <a
          href="#/"
          className={`filter__link ${
            currentFilter === SORT.ALL ? 'selected' : ''
          }`}
          onClick={() => setCurrentFilter(SORT.ALL)}
        >
          All
        </a>

        <a
          href="#/active"
          className={`filter__link ${
            currentFilter === SORT.ACTIVE ? 'selected' : ''
          }`}
          onClick={() => setCurrentFilter(SORT.ACTIVE)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={`filter__link ${
            currentFilter === SORT.COMPLETED ? 'selected' : ''
          }`}
          onClick={() => setCurrentFilter(SORT.COMPLETED)}
        >
          Completed
        </a>
      </nav>

      {completedItemsCount > 0 && (
        <button
          type="button"
          className="todoapp__clear-completed"
          onClick={() => {
            resetCompleted();
          }}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
