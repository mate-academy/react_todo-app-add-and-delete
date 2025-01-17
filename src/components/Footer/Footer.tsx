import React from "react";
import classNames from "classnames";

import { Filter } from "../../types/Filter";

type Props = {
  totalCount: number;
  activeCount: number;
  clearCompleted: () => void;

  filter: Filter;
  setFilter: (newFilter: Filter) => void;
};

export const Footer: React.FC<Props> = React.memo(function Footer({
  totalCount,
  activeCount,
  clearCompleted,

  filter,
  setFilter,
}) {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames("filter__link", { selected: filter === "All" })}
          data-cy="FilterLinkAll"
          onClick={() => setFilter("All")}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames("filter__link", {
            selected: filter === "Active",
          })}
          data-cy="FilterLinkActive"
          onClick={() => setFilter("Active")}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames("filter__link", {
            selected: filter === "Completed",
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setFilter("Completed")}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={totalCount === activeCount}
        onClick={clearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
});
