import classNames from 'classnames';

type Props = {
  filtered: string;
  setFiltered: (selected: string) => void;
};

export const Filter: React.FC<Props> = ({ filtered, setFiltered }) => {
  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={classNames('filter__link', { selected: filtered === 'all' })}
        data-cy="FilterLinkAll"
        onClick={() => setFiltered('all')}
      >
        All
      </a>

      <a
        href="#/active"
        className={classNames('filter__link', {
          selected: filtered === 'active',
        })}
        data-cy="FilterLinkActive"
        onClick={() => setFiltered('active')}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={classNames('filter__link', {
          selected: filtered === 'completed',
        })}
        data-cy="FilterLinkCompleted"
        onClick={() => setFiltered('completed')}
      >
        Completed
      </a>
    </nav>
  );
};
