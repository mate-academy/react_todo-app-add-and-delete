import { useContext } from 'react';
import { FilterStatuses, FilterDataCy } from '../data/enums';
import classNames from 'classnames';
import { TodosContext } from './todosContext';

export const TodosFilter: React.FC = () => {
  const { selectedFilter, setSelectedFilter } = useContext(TodosContext);

  const handleOnClick = (status: FilterStatuses) => {
    switch (status) {
      case FilterStatuses.All:
        setSelectedFilter(FilterStatuses.All);
        break;
      case FilterStatuses.Active:
        setSelectedFilter(FilterStatuses.Active);
        break;
      case FilterStatuses.Completed:
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
      case FilterStatuses.All:
        return FilterDataCy.All;
      case FilterStatuses.Active:
        return FilterDataCy.Active;
      case FilterStatuses.Completed:
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
