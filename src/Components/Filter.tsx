interface Props {
  countNotCompletedtodos: number,
  handleFilter: (value: string) => void,
  filter: string,
  handleRemoveCompletedTodos: () => void,
}

export const Filter: React.FC<Props> = ({
  countNotCompletedtodos,
  handleFilter,
  filter,
  handleRemoveCompletedTodos,
}) => {
  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${countNotCompletedtodos} items left`}
      </span>

      {/* Active filter should have a 'selected' class */}
      <nav className="filter">
        <a
          href="#/"
          className={`filter__link ${filter === 'All' && 'selected'}`}
          onClick={() => handleFilter('All')}
        >
          All
        </a>

        <a
          href="#/active"
          className={`filter__link ${filter === 'Active' && 'selected'}`}
          onClick={() => handleFilter('Active')}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={`filter__link ${filter === 'Completed' && 'selected'}`}
          onClick={() => handleFilter('Completed')}
        >
          Completed
        </a>
      </nav>

      {/* don't show this button if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        onClick={handleRemoveCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
