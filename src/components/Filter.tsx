import cn from 'classnames';

export enum FilterStatus {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}

type Props = {
  value: FilterStatus;
  onChange: (nextStatus: FilterStatus) => void;
};

const FILTERS: FilterStatus[] = [
  FilterStatus.All,
  FilterStatus.Active,
  FilterStatus.Completed,
];

const getHref = (status: FilterStatus) =>
  status === FilterStatus.All ? '#/' : `#/${status}`;

const toTitle = (status: FilterStatus) =>
  status.charAt(0).toUpperCase() + status.slice(1);

export const Filter: React.FC<Props> = ({ value, onChange }) => {
  const handleLinkClick = (
    nextStatus: FilterStatus,
    event: React.MouseEvent<HTMLAnchorElement>,
  ) => {
    event.preventDefault();
    onChange(nextStatus);
  };

  return (
    <nav className="filter" data-cy="Filter">
      {FILTERS.map(status => (
        <a
          key={status}
          href={getHref(status)}
          className={cn('filter__link', { selected: value === status })}
          data-cy={`FilterLink${toTitle(status)}`}
          onClick={event => handleLinkClick(status, event)}
          aria-current={value === status ? 'page' : undefined}
        >
          {toTitle(status)}
        </a>
      ))}
    </nav>
  );
};
