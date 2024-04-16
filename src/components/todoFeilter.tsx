import { useContext } from 'react';
import { FilterContext } from './filterContext';

export const TodosFilter: React.FC = () => {
  enum Status {
    All = 'All',
    Active = 'Active',
    Completed = 'Completed',
  }

  const {
    isAllSelected,
    setIsAllSelected,
    isActiveSelected,
    setIsActiveSelected,
    isCompletedSelected,
    setIsCompletedSelected,
  } = useContext(FilterContext);

  const handleAllfilter = () => {
    setIsAllSelected(true);
    setIsActiveSelected(false);
    setIsCompletedSelected(false);
  };

  const handleActivefilter = () => {
    setIsActiveSelected(true);
    setIsAllSelected(false);
    setIsCompletedSelected(false);
  };

  const handleCompletedfilter = () => {
    setIsCompletedSelected(true);
    setIsAllSelected(false);
    setIsActiveSelected(false);
  };

  return (
    <>
      <a
        href="#/"
        className={`filter__link ${isAllSelected === true ? 'selected' : ''}`}
        data-cy="FilterLinkAll"
        onClick={handleAllfilter}
      >
        {Status.All}
      </a>

      <a
        href="#/active"
        className={`filter__link ${isActiveSelected === true ? 'selected' : ''}`}
        data-cy="FilterLinkActive"
        onClick={handleActivefilter}
      >
        {Status.Active}
      </a>

      <a
        href="#/completed"
        className={`filter__link ${isCompletedSelected === true ? 'selected' : ''}`}
        data-cy="FilterLinkCompleted"
        onClick={handleCompletedfilter}
      >
        {Status.Completed}
      </a>
    </>
  );
};
