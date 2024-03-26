import cn from 'classnames';
import { FilterTodos } from '../../types/FilterTodos';
import { useTodosContext } from '../../utils/useTodosContext';

export const TodoFilter: React.FC = ({}) => {
  const { filterSelected, setFilterSelected } = useTodosContext();
  const filterMenu = Object.values(FilterTodos);

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
