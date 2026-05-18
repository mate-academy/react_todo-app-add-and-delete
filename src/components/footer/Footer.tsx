import { Status } from '../../types/Status';

export const Footer: React.FC<{
  status: Status;
  setStatus: (status: Status) => void;
  completedTodosCount: number;
  activeTodosCount: number;
  deleteAllCompletedTodos: () => void;
}> = ({
  status,
  setStatus,
  completedTodosCount,
  activeTodosCount,
  deleteAllCompletedTodos,
}) => {
  const filterLinks = [
    { id: 1, label: 'All', status: Status.All, href: '#/' },
    { id: 2, label: 'Active', status: Status.Active, href: '#/active' },
    {
      id: 3,
      label: 'Completed',
      status: Status.Completed,
      href: '#/completed',
    },
  ];

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosCount} items left
      </span>
      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        {filterLinks.map(({ id, label, status: linkStatus, href }) => (
          <a
            key={id}
            href={href}
            className={`filter__link ${status === linkStatus ? 'selected' : ''}`}
            data-cy={`FilterLink${label}`}
            onClick={() => setStatus(linkStatus)}
          >
            {label}
          </a>
        ))}
      </nav>
      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={completedTodosCount === 0}
        onClick={deleteAllCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
