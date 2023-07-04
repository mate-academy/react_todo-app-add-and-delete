import cn from 'classnames';

type Props = {
  filter: string,
  setFilter: (newFilter:string) => void;
};

export const TodoFilter:React.FC<Props> = ({
  filter,
  setFilter,
}) => {
  const handleFilterChange = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const newFilter = event.currentTarget.textContent || '';

    setFilter(newFilter);
  };

  return (
    <nav className="filter">
      <a
        href="#/"
        className={cn('filter__link', {
          selected: filter === 'All',
        })}
        onClick={handleFilterChange}
      >
        All
      </a>

      <a
        href="#/active"
        className={cn('filter__link', {
          selected: filter === 'Active',
        })}
        onClick={handleFilterChange}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={cn('filter__link', {
          selected: filter === 'Completed',
        })}
        onClick={handleFilterChange}
      >
        Completed
      </a>
    </nav>
  );
};
