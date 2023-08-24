import React, { useState } from 'react';

type Props = {
  changeQuery: (query: string) => void,
  isCompleted: boolean,
  numberActive: number,
};

enum StatusTodos {
  all = 'All',
  active = 'Active',
  completed = 'Completed',
}

export const Footer: React.FC<Props> = ({
  changeQuery,
  isCompleted,
  numberActive,
}) => {
  const [status, setStatus] = useState('All');

  const handleClickAll = () => {
    changeQuery(StatusTodos.all);
    setStatus(StatusTodos.all);
  };

  const handleClickActive = () => {
    changeQuery(StatusTodos.active);
    setStatus(StatusTodos.active);
  };

  const handleClickCompleted = () => {
    changeQuery(StatusTodos.completed);
    setStatus(StatusTodos.completed);
  };

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${numberActive} items left`}
      </span>

      {/* Active filter should have a 'selected' class */}
      <nav className="filter">
        <a
          onClick={handleClickAll}
          href="#/"
          className={`filter__link ${status === 'All' && 'selected'}`}
        >
          All
        </a>

        <a
          onClick={handleClickActive}
          href="#/active"
          className={`filter__link ${status === 'Active' && 'selected'}`}
        >
          Active
        </a>

        <a
          onClick={handleClickCompleted}
          href="#/completed"
          className={`filter__link ${status === 'Completed' && 'selected'}`}
        >
          Completed
        </a>
      </nav>

      {/* don't show this button if there are no completed todos */}
      <button
        style={{ visibility: `${isCompleted ? 'visible' : 'hidden'}` }}
        type="button"
        className="todoapp__clear-completed"
      >
        Clear completed
      </button>
    </footer>
  );
};
