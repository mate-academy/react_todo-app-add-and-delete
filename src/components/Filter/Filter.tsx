import classNames from 'classnames';
import { FilterType } from '../../types/Todo';

interface Props {
  filter: FilterType;
}

export const Filter: React.FC<Props> = ({ filter }) => {
  const links = [
    { href: '#/', type: FilterType.All, label: 'All' },
    { href: '#/active', type: FilterType.Active, label: 'Active' },
    { href: '#/completed', type: FilterType.Completed, label: 'Completed' },
  ];

  return (
    <nav className="filter" data-cy="Filter">
      {links.map(({ href, type, label }) => (
        <a
          key={type}
          href={href}
          className={classNames('filter__link', {
            selected: filter === type,
          })}
          data-cy={`FilterLink${label}`}
        >
          {label}
        </a>
      ))}
    </nav>
  );
};
