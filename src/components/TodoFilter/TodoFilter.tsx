import { useTodos } from '../../context/TodoProvider';

export const TodoFilter = () => {
  const { option, setOption } = useTodos();

  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={option === 'all'
          ? ('filter__link selected')
          : ('filter__link')}
        data-cy="FilterLinkAll"
        onClick={() => setOption('all')}
      >
        All
      </a>

      <a
        href="#/active"
        className={option === 'active'
          ? ('filter__link selected')
          : ('filter__link')}
        data-cy="FilterLinkActive"
        onClick={() => setOption('active')}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={option === 'completed'
          ? ('filter__link selected')
          : ('filter__link')}
        data-cy="FilterLinkCompleted"
        onClick={() => setOption('completed')}
      >
        Completed
      </a>
    </nav>
  );
};
