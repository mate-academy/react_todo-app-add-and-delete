import cn from 'classnames';
import { FilterParams } from '../../types/enums';

interface FilterProps {
  selectedFilterParam: FilterParams;
  handleChangeFilterParam: (param: FilterParams) => void;
}

export const Filter: React.FC<FilterProps> = ({
  selectedFilterParam,
  handleChangeFilterParam,
}) => {
  const filterParams = Object.values(FilterParams);

  return (
    <nav className="filter" data-cy="Filter">
      {filterParams.map(param => (
        <a
          key={param}
          href={param === FilterParams.All ? '#/' : `#/${param.toLowerCase()}`}
          className={cn('filter__link', {
            selected: selectedFilterParam === param,
          })}
          data-cy={`FilterLink${param}`}
          onClick={event => {
            event.preventDefault();
            handleChangeFilterParam(param);
          }}
        >
          {param}
        </a>
      ))}
    </nav>
  );
};
