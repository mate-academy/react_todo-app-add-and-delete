import React, { useState } from 'react';

import { FilterByWords } from '../../types/enums';

type Props = {
  setFilterHandler: (param: FilterByWords) => void;
  todoCounter: number;
};

export const Footer: React.FC<Props> = ({ setFilterHandler, todoCounter }) => {
  const [selectedFilter, setSelectedFilter] = useState(FilterByWords.All);

  const handleFilterClick = (filter: FilterByWords) => {
    setSelectedFilter(filter);
    setFilterHandler(filter);
  };

  return (
    <>
      <span className="todo-count">
        {`${todoCounter} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={`filter__link ${selectedFilter === 'All' ? 'selected' : ''}`}
          onClick={() => handleFilterClick(FilterByWords.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={`filter__link ${selectedFilter === 'Active' ? 'selected' : ''}`}
          onClick={() => handleFilterClick(FilterByWords.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={`filter__link ${selectedFilter === 'Completed' ? 'selected' : ''}`}
          onClick={() => handleFilterClick(FilterByWords.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
      /*   onClick={() => setFilterHandler(FilterByWords.Clear)} */
      >
        Clear completed
      </button>
    </>
  );
};
