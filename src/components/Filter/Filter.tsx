import classNames from 'classnames';

type Props = {
  filterParam: string,
  onSetFilter: (filterParam: string) => void,
};

export const Filter: React.FC<Props> = ({ filterParam, onSetFilter }) => {
  return (
    <nav className="filter" data-cy="Filter">
      <a
        data-cy="FilterLinkAll"
        href="#/"
        className={classNames('filter__link',
          {
            selected: filterParam === 'All',
          })}
        onClick={() => onSetFilter('All')}
      >
        All
      </a>
      <a
        data-cy="FilterLinkAll"
        href="#/"
        className={classNames('filter__link',
          {
            selected: filterParam === 'Active',
          })}
        onClick={() => onSetFilter('Active')}
      >
        Active
      </a>
      <a
        data-cy="FilterLinkAll"
        href="#/"
        className={classNames('filter__link',
          {
            selected: filterParam === 'Completed',
          })}
        onClick={() => onSetFilter('Completed')}
      >
        Completed
      </a>
    </nav>
  );
};
