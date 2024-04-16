import { useContext } from 'react';
import { FilterContext } from './filterContext';
import classNames from 'classnames';

export const TodosFilter: React.FC = () => {
  const { isSelected, setIsSelected } = useContext(FilterContext);

  const handleOnClick = (status: string) => {
    switch (status) {
      case 'All':
        setIsSelected('All');
        break;
      case 'Active':
        setIsSelected('Active');
        break;
      case 'Completed':
        setIsSelected('Completed');
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

  return (
    <>
      {Object.values(filterStatuses).map(value => (
        <a
          key={value}
          href="#/"
          className={getClassForMaper(value)}
          data-cy="FilterLinkAll"
          onClick={() => handleOnClick(value)}
        >
          {value}
        </a>
      ))}
    </>
  );
};
