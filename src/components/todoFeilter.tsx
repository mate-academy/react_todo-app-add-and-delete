import { useContext } from 'react';
import { FilterContext } from './filterContext';
import { FilterStatuses, FilterDataCy } from '../data/enums';
import classNames from 'classnames';

export const TodosFilter: React.FC = () => {
  const { selectedFilter, setSelectedFilter } = useContext(FilterContext);

  const handleOnClick = (status: FilterStatuses) => {
    switch (status) {
      case 'All':
        setSelectedFilter(FilterStatuses.All);
        break;
      case 'Active':
        setSelectedFilter(FilterStatuses.Active);
        break;
      case 'Completed':
        setSelectedFilter(FilterStatuses.Completed);
        break;
      default:
        break;
    }
  };

  const getClassForMaper = (status: string) => {
    const maperClass = classNames({
      filter__link: true,
      selected: status === selectedFilter,
    });

    return maperClass;
  };

  const handleDataCy = (status: FilterStatuses) => {
    switch (status) {
      case 'All':
        return FilterDataCy.All;
      case 'Active':
        return FilterDataCy.Active;
      case 'Completed':
        return FilterDataCy.Completed;
      default:
        return;
    }
  };

  return (
    <>
      {Object.values(FilterStatuses).map(value => (
        <a
          key={value}
          href="#/"
          className={getClassForMaper(value)}
          data-cy={handleDataCy(value)}
          onClick={() => handleOnClick(value)}
        >
          {value}
        </a>
      ))}
    </>
  );
};
