import cn from 'classnames';
import { FilterTodos } from '../../types/FilterTodos';

type Props = {
  filterSelected: FilterTodos | string;
  setFilterSelected: (filterSelected: FilterTodos) => void;
};

export const TodoFilter: React.FC<Props> = ({
  filterSelected,
  setFilterSelected,
}) => {
  const filterMenu = [
    FilterTodos.all,
    FilterTodos.active,
    FilterTodos.completed,
  ];

  return (
    <nav className="filter" data-cy="Filter">
      {filterMenu.map(filter => (
        <a
          key={filter}
          href={
            filterSelected === FilterTodos.all
              ? '#/'
              : `#/${filterSelected.toLowerCase()}`
          }
          className={cn('filter__link', {
            selected: filterSelected === filter,
          })}
          data-cy={`FilterLink${filter}`}
          onClick={() => setFilterSelected(filter)}
        >
          {filter}
        </a>
      ))}
    </nav>
  );
};
