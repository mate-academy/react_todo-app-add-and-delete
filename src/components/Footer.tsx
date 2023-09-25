type FooterProps = {
  countText: string
  allClasses: string
  onClickAll: () => void
  activeClasses: string
  onClickActive: () => void
  completedClasses: string
  onClickCompleted: () => void
  existsCompleteTodo: boolean
  onClickClearCompleted: () => void
};

export const Footer = ({
  countText,
  allClasses,
  onClickAll,
  activeClasses,
  onClickActive,
  completedClasses,
  onClickCompleted,
  existsCompleteTodo,
  onClickClearCompleted,
}: FooterProps) => {
  return (
    <footer className="todoapp__footer">
      <span className="todo-count" data-cy="TodosCounter">
        {countText}
      </span>

      <nav data-cy="Filter" className="filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={allClasses}
          onClick={onClickAll}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={activeClasses}
          onClick={onClickActive}
        >
          Active
        </a>

        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={completedClasses}
          onClick={onClickCompleted}
        >
          Completed
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        onClick={onClickClearCompleted}
        disabled={!existsCompleteTodo}
      >
        Clear completed
      </button>
    </footer>
  );
};
