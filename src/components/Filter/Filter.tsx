import cn from 'classnames';

import { FilterParams } from '../../constants/filter';

type Props = {
  selectedFilterParam: FilterParams;
  handleChangeFilterParam: (param: FilterParams) => void;
};

export const Filter: React.FC<Props> = ({
  selectedFilterParam,
  handleChangeFilterParam,
}) => {
  const filterParams = Object.values(FilterParams);

  return (
    <nav className="filter" data-cy="Filter">
      {filterParams.map(param => (
        <a
          href={param === FilterParams.ALL ? '#/' : `#/${param.toLowerCase()}`}
          key={param}
          className={cn('filter__link', {
            selected: selectedFilterParam === param,
          })}
          data-cy={`FilterLink${param}`}
          onClick={e => {
            e.preventDefault();
            handleChangeFilterParam(param);
          }}
        >
          {param}
        </a>
      ))}
    </nav>
  );
};
