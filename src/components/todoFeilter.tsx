import { useContext } from 'react';
import { FilterContext } from './filterContext';
import classNames from 'classnames';

export const TodosFilter: React.FC = () => {
  const { isSelected, setIsSelected } = useContext(FilterContext);

  enum FilterStatuses {
    All = 'All',
    Active = 'Active',
    Completed = 'Completed',
  }

  enum FilterDataCy {
    All = 'FilterLinkAll',
    Active = 'FilterLinkActive',
    Completed = 'FilterLinkCompleted',
  }

  const handleOnClick = (status: string) => {
    switch (status) {
      case 'All':
        setIsSelected(FilterStatuses.All);
        break;
      case 'Active':
        setIsSelected(FilterStatuses.Active);
        break;
      case 'Completed':
        setIsSelected(FilterStatuses.Completed);
        break;
      default:
        break;
    }
  };

  const getClassForMaper = (status: string) => {
    const maperClass = classNames({
      filter__link: true,
      selected: status === isSelected,
    });

    return maperClass;
  };

  const filterStatuses = {
    All: 'All',
    Active: 'Active',
    Completed: 'Completed',
  };

  const handleDataCy = (status: string) => {
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
      {Object.values(filterStatuses).map(value => (
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
