type Props = {
  selected: string;
  selectTodoFilter: (filter: string) => void;
};

export const Nav: React.FC<Props> = ({ selected, selectTodoFilter }) => {
  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={
          selected === 'all' ? 'filter__link selected' : 'filter__link'
        }
        data-cy="FilterLinkAll"
        onClick={() => selectTodoFilter('all')}
      >
        All
      </a>

      <a
        href="#/active"
        className={
          selected === 'active' ? 'filter__link selected' : 'filter__link'
        }
        data-cy="FilterLinkActive"
        onClick={() => selectTodoFilter('active')}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={
          selected === 'completed' ? 'filter__link selected' : 'filter__link'
        }
        data-cy="FilterLinkCompleted"
        onClick={() => selectTodoFilter('completed')}
      >
        Completed
      </a>
    </nav>
  );
};
