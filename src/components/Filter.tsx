import cn from 'classnames';

interface FilterProps {
  filter: string,
  filterAll: () => void,
  filterActive: () => void,
  filterCompleted: () => void,
}

export const Filter: React.FC<FilterProps> = ({
  filter,
  filterActive,
  filterAll,
  filterCompleted,
}) => {
  return (
    <nav className="filter">
      <a
        href="#/"
        className={cn('filter__link', {
          selected: filter === 'all',
        })}
        onClick={filterAll}
      >
        All
      </a>

      <a
        href="#/active"
        className={cn('filter__link', {
          selected: filter === 'active',
        })}
        onClick={filterActive}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={cn('filter__link', {
          selected: filter === 'completed',
        })}
        onClick={filterCompleted}
      >
        Completed
      </a>
    </nav>
  );
};
