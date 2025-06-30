import { FilterButtonsProps } from '../../types/FilterButtonsProps';
import classNames from 'classnames';
import { FilterStatus } from '../../types/FilterButtonsProps';

export const FilterButtons: React.FC<FilterButtonsProps> = ({
  filterStatus,
  setFilterStatus,
}) => {
  return (
    <div data-cy="Filter">
      {Object.values(FilterStatus).map(type => (
        <a
          key={type}
          href={`#/${type === FilterStatus.All ? '' : type}`}
          className={classNames('filter__link', {
            selected: filterStatus === type,
          })}
          data-cy={`FilterLink${type[0].toUpperCase() + type.slice(1)}`}
          onClick={e => {
            e.preventDefault();
            setFilterStatus(type);
          }}
        >
          {type[0].toUpperCase() + type.slice(1)}
        </a>
      ))}
    </div>
  );
};
