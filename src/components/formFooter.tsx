export const FormFooter = ({
  remainingCount,
  filter,
  onFilterChange,
  hasCompleted,
  onClearCompleted,
}: {
  remainingCount: number;
  filter: 'all' | 'active' | 'completed';
  onFilterChange: (f: 'all' | 'active' | 'completed') => void;
  hasCompleted: boolean;
  onClearCompleted: () => Promise<void> | void;
}) => {
  const filters = [
    { value: 'all', label: 'All', cy: 'FilterLinkAll' },
    { value: 'active', label: 'Active', cy: 'FilterLinkActive' },
    { value: 'completed', label: 'Completed', cy: 'FilterLinkCompleted' },
  ];

  {
    filters.map(f => (
      <a
        key={f.value}
        href={`#/ ${f.value}`}
        className={`filter__link ${f.value === filter ? 'selected' : ''}`}
        data-cy={f.cy}
        onClick={e => {
          e.preventDefault();
          onFilterChange(f.value as 'all' | 'active' | 'completed');
        }}
      >
        {f.label}
      </a>
    ));
  }

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {remainingCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={`filter__link ${filter === 'all' ? 'selected' : ''}`}
          data-cy="FilterLinkAll"
          onClick={e => {
            e.preventDefault();
            onFilterChange('all');
          }}
        >
          All
        </a>

        <a
          href="#/active"
          className={`filter__link ${filter === 'active' ? 'selected' : ''}`}
          data-cy="FilterLinkActive"
          onClick={e => {
            e.preventDefault();
            onFilterChange('active');
          }}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={`filter__link ${filter === 'completed' ? 'selected' : ''}`}
          data-cy="FilterLinkCompleted"
          onClick={e => {
            e.preventDefault();
            onFilterChange('completed');
          }}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!hasCompleted}
        onClick={() => onClearCompleted()}
      >
        Clear completed
      </button>
    </footer>
  );
};
