import classNames from 'classnames';

interface TodoFooterProps {
  remainingTodos: number;
  filter: string;
  setFilter: (filter: string) => void;
  hasCompletedTodos: boolean;
  onClearCompleted: () => void;
}

export const TodoFooter: React.FC<TodoFooterProps> = (
  {
    remainingTodos,
    filter,
    setFilter,
    hasCompletedTodos,
    onClearCompleted,
  },
) => (
  <footer className="todoapp__footer">
    <span className="todo-count">
      {remainingTodos}
      {' items left'}
    </span>

    <nav className="filter">
      <a
        href="#/"
        className={
          classNames(
            'filter__link',
            { selected: filter === 'all' },
          )
        }
        onClick={() => setFilter('all')}
      >
        All
      </a>

      <a
        href="#/active"
        className={
          classNames(
            'filter__link',
            { selected: filter === 'active' },
          )
        }
        onClick={() => setFilter('active')}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={
          classNames(
            'filter__link',
            { selected: filter === 'completed' },
          )
        }
        onClick={() => setFilter('completed')}
      >
        Completed
      </a>
    </nav>

    <button
      type="button"
      className="todoapp__clear-completed"
      onClick={onClearCompleted}
      disabled={!hasCompletedTodos}
    >
      Clear completed
    </button>
  </footer>
);
