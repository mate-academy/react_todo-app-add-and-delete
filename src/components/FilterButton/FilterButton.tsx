import cn from 'classnames';
import { TodosFilter } from '../../types/TodosFilter';
import './filterButton.scss';

export const FilterButton: React.FC<{
  filter: TodosFilter;
  selectedFilter: TodosFilter;
  onClick: () => void;
}> = ({ filter, selectedFilter, onClick }) => {
  return (
    <a
      key={filter}
      href={`#/${filter.toLowerCase()}`}
      className={cn('filter__link', {
        selected: filter === selectedFilter,
      })}
      data-cy={`FilterLink${[filter]}`}
      onClick={onClick}
    >
      {filter}
    </a>
  );
};
