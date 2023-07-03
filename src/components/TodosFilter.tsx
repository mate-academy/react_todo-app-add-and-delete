import cn from 'classnames';
import { FC } from 'react';
import { FilterType } from '../Enums/FilterType';

interface Props {
  currentFilterType: FilterType,
  setFilterType: React.Dispatch<React.SetStateAction<FilterType>>,
}

export const TodosFilter:FC<Props> = ({ setFilterType, currentFilterType }) => {
  const handleSelectFilterType = (
    type: FilterType,
  ) => {
    setFilterType(type);
  };

  return (
    <nav className="filter">
      {Object.entries(FilterType).map(([key, value]) => (
        <a
          key={key}
          href={`#/${value}`}
          className={cn('filter__link', {
            selected: value === currentFilterType,
          })}
          onClick={() => handleSelectFilterType(value)}
        >
          {value[0].toUpperCase() + value.slice(1)}
        </a>
      ))}
    </nav>
  );
};
