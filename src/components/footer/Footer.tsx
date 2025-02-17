import React from 'react';

type Props = {
  status: string;
  onClick: (status: string) => void;
  items: number;
};

export const Footer: React.FC<Props> = ({ status, items, onClick }) => {
  if (items === 0) {
    return null;
  }

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {items} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={`filter__link ${status === 'all' && 'selected'}`}
          data-cy="FilterLinkAll"
          onClick={() => onClick('all')}
        >
          All
        </a>

        <a
          href="#/active"
          className={`filter__link ${status === 'active' && 'selected'}`}
          data-cy="FilterLinkActive"
          onClick={() => onClick('active')}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={`filter__link ${status === 'completed' && 'selected'}`}
          data-cy="FilterLinkCompleted"
          onClick={() => onClick('completed')}
        >
          Completed
        </a>
      </nav>

      {/* this button should be disabled if there are no completed todos */}
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
