import { useTodos } from '../Context';

export const TodoFooter: React.FC = () => {
  const { todos, filter, setFilter } = useTodos();

  const countActiveTodos = () => {
    return todos.filter(todo => !todo.completed).length;
  };

  const handleFilterClick = (type: string) => {
    setFilter(type);
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${countActiveTodos()} items left`}
      </span>

      {/* Active filter should have a 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={
            filter === 'all'
              ? 'selected filter__link'
              : 'filter__link'
          }
          data-cy="FilterLinkAll"
          onClick={() => handleFilterClick('all')}
        >
          All
        </a>

        <a
          href="#/active"
          className={
            filter === 'active'
              ? 'selected filter__link'
              : 'filter__link'
          }
          data-cy="FilterLinkActive"
          onClick={() => handleFilterClick('active')}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={
            filter === 'completed'
              ? 'selected filter__link'
              : 'filter__link'
          }
          data-cy="FilterLinkCompleted"
          onClick={() => handleFilterClick('completed')}
        >
          Completed
        </a>
      </nav>

      {/* don't show this button if there are no completed todos */}
      {countActiveTodos() !== todos.length && (
        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
