import classNames from 'classnames';

type Props = {
  setFilterValue: (filterValue: string) => void;
  filterValue: string;
};

export const TodoFilter = ({ setFilterValue, filterValue }: Props) => {
  return (
    <nav className="filter">
      <a
        href="#/"
        className={classNames('filter__link', {
          selected: filterValue === 'all',
        })}
        onClick={() => setFilterValue('all')}
      >
        All
      </a>

      <a
        href="#/active"
        className={classNames('filter__link', {
          selected: filterValue === 'active',
        })}
        onClick={() => setFilterValue('active')}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={classNames('filter__link', {
          selected: filterValue === 'completed',
        })}
        onClick={() => setFilterValue('completed')}
      >
        Completed
      </a>
    </nav>
  );
};
