import React, { useContext, useEffect, useState } from 'react';
import { Status } from '../services/Status';
// eslint-disable-next-line import/no-cycle
import { TodosContext } from './TodosContext';

export const Footer: React.FC = () => {
  const {
    todos,
    clearForm,
    setFilter,
    filter,
  } = useContext(TodosContext);
  const [count, setCount] = useState(0);

  const updateCount = () => {
    const counts = todos.filter(todo => !todo.completed).length;

    setCount(counts);
  };

  const hasCompleted = todos.some(todo => todo.completed);

  // Performed when you change the task list (Toodos)
  useEffect(() => {
    updateCount();
  }, [todos]);

  return (
    <>
      {todos.length > 0 && (
        <footer className="todoapp__footer">
          <span className="todo-count">{`${count} items left`}</span>

          <nav className="filter">
            <a
              href="#/"
              className={`filter__link ${
                filter === Status.ALL ? 'selected' : ''
              }`}
              onClick={() => setFilter(Status.ALL)}
            >
              All
            </a>

            <a
              href="#/active"
              className={`filter__link ${
                filter === Status.ACTIVE ? 'selected' : ''
              }`}
              onClick={() => setFilter(Status.ACTIVE)}
            >
              Active
            </a>

            <a
              href="#/completed"
              className={`filter__link ${
                filter === Status.COMPLETED ? 'selected' : ''
              }`}
              onClick={() => setFilter(Status.COMPLETED)}
            >
              Completed
            </a>
          </nav>

          {hasCompleted && (
            <button
              type="button"
              className="todoapp__clear-completed"
              onClick={clearForm}
            >
              Clear completed
            </button>
          )}
        </footer>
      )}
    </>
  );
};
