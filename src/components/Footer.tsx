import React from "react";
import { Todo } from "../types/Todo";

type FooterProps = {
  todos: Todo[];
  filterType: "All" | "Active" | "Completed";
  changeFilterStatus: (type: "All" | "Active" | "Completed") => void;
  handleClearCompleted: () => void;
};

export const Footer: React.FC<FooterProps> = ({
  todos,
  filterType,
  changeFilterStatus,
  handleClearCompleted,
}) => {
  const remainingItems = todos.filter((todo) => !todo.completed).length;
  const completedItems = todos.filter((todo) => todo.completed).length;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${remainingItems} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={`filter__link ${filterType === "All" ? "selected" : ""}`}
          onClick={() => changeFilterStatus("All")}
          data-cy="FilterLinkAll"
        >
          All
        </a>

        <a
          href="#/active"
          className={`filter__link ${
            filterType === "Active" ? "selected" : ""
          }`}
          onClick={() => changeFilterStatus("Active")}
          data-cy="FilterLinkActive"
        >
          Active
        </a>

        <a
          href="#/completed"
          className={`filter__link ${
            filterType === "Completed" ? "selected" : ""
          }`}
          onClick={() => changeFilterStatus("Completed")}
          data-cy="FilterLinkCompleted"
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={handleClearCompleted}
        disabled={completedItems === 0}
        hidden={completedItems === 0}
      >
        Clear completed
      </button>
    </footer>
  );
};
