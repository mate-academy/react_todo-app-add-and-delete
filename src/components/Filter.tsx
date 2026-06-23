import classNames from 'classnames';
import { FilterType } from '../App';

type Props = {
  filter: FilterType;
  setFilter: (filter: FilterType) => void;
};
export const Filter: React.FC<Props> = ({ filter, setFilter }) => {
  const filters: { status: FilterType; label: string; href: string }[] = [
    { status: 'All', label: 'All', href: '#/' },
    { status: 'Active', label: 'Active', href: '#/active' },
    { status: 'Completed', label: 'Completed', href: '#/completed' },
  ];

  return (
    <nav className="filter" data-cy="Filter">
      {filters.map(linkFilter => (
        <a
          key={linkFilter.status}
          href={linkFilter.href}
          className={classNames('filter__link', {
            selected: filter === linkFilter.status,
          })}
          data-cy={`FilterLink${linkFilter.status}`}
          onClick={() => setFilter(linkFilter.status)}
        >
          {linkFilter.label}
        </a>
      ))}
    </nav>
  );
};
