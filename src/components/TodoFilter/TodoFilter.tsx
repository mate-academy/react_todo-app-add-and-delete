import { FC, Dispatch, SetStateAction } from 'react';
import classNames from 'classnames';
import { capitalizeString } from '../../utils/capitalizeString';
import { StatusFilter } from '../../types/StatusFilter';

type Props = {
  filterValue: StatusFilter;
  setFilterValue: Dispatch<SetStateAction<StatusFilter>>;
};

export const TodoFilter: FC<Props> = props => {
  const { filterValue, setFilterValue } = props;

  return (
    <nav className="filter" data-cy="Filter">
      {Object.values(StatusFilter).map(value => {
        return (
          <a
            key={value}
            href={`#/${value === StatusFilter.All ? '' : value}`}
            className={classNames('filter__link', {
              selected: value === filterValue,
            })}
            data-cy={`FilterLink${capitalizeString(value)}`}
            onClick={() => setFilterValue(value)}
          >
            {capitalizeString(value)}
          </a>
        );
      })}
    </nav>
  );
};
