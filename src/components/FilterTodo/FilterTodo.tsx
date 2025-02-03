import cn from 'classnames';
import { FilterOption } from '../../types/FilterOption';

type Props = {
  selectedOption: FilterOption;
  onSelect: (option: FilterOption) => void;
};

export const FilterTodo: React.FC<Props> = ({ selectedOption, onSelect }) => {
  return (
    <nav className="filter" data-cy="Filter">
      {Object.values(FilterOption).map(value => (
        <a
          key={value}
          href="#/"
          className={cn('filter__link', { selected: selectedOption === value })}
          data-cy={`FilterLink${value.charAt(0).toUpperCase() + value.slice(1)}`}
          onClick={() => onSelect(value)}
        >
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </a>
      ))}
    </nav>
  );
};
