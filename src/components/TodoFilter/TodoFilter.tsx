import classNames from 'classnames';
import { FilterOptions } from '../../enums/FilterOptions';

interface TodoFilterProps {
  filterSelected: FilterOptions;
  setFilterSelected: (filterSelected: FilterOptions) => void;
}

export const TodoFilter: React.FC<TodoFilterProps> = ({
  filterSelected,
  setFilterSelected,
}) => {
  const filteringOptions = Object.values(FilterOptions);

  return (
    <nav className="filter" data-cy="Filter">
      {filteringOptions.map(link => (
        <a
          href="#/"
          key={link}
          className={classNames('filter__link', {
            selected: filterSelected === link,
          })}
          data-cy={`FilterLink${link}`}
          onClick={() => setFilterSelected(link)}
        >
          {link}
        </a>
      ))}
    </nav>
  );
};
