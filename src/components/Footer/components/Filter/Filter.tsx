import classNames from 'classnames';

interface Props {
  status: string;
  setStatus: (value: string) => void;
}

const statuses = [
  {
    path: '',
    title: 'All',
  },
  {
    path: 'active',
    title: 'Active',
  },
  {
    path: 'completed',
    title: 'Completed',
  },
];

export const Filter: React.FC<Props> = ({
  status,
  setStatus,
}) => (
  <nav className="filter">
    {statuses.map(({ title, path }) => (
      <a
        key={title}
        href={`#/${path}`}
        className={classNames(
          'filter__link',
          { selected: status === title },
        )}
        onClick={() => setStatus(title)}
      >
        {title}
      </a>
    ))}
  </nav>
);
