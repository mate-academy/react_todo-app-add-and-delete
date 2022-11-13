import classNames from 'classnames';
import { useContext, useState } from 'react';
import { SortParam } from '../../types/SortParam';
import { AppContext } from '../AppContext';

enum FilterLink {
  All = 'FilterLinkAll',
  Active = 'FilterLinkActive',
  Completed = 'FilterLinkCompleted',
}

export const Filter: React.FC = () => {
  const [activeButton, setActiveButton] = useState('all');
  const { setSortBy } = useContext(AppContext);

  function selectSort(param?: string) {
    switch (param) {
      case FilterLink.All:
        setSortBy(SortParam.All);
        setActiveButton(SortParam.All);
        break;

      case FilterLink.Active:
        setSortBy(SortParam.Active);
        setActiveButton(SortParam.Active);
        break;

      case FilterLink.Completed:
        setSortBy(SortParam.Completed);
        setActiveButton(SortParam.Completed);
        break;

      default:
        break;
    }
  }

  return (
    <nav className="filter" data-cy="Filter">
      <a
        data-cy={FilterLink.All}
        href="#/"
        className={classNames(
          'filter__link',
          {
            selected: activeButton === 'all',
          },
        )}
        onClick={(event) => selectSort(event.currentTarget.dataset.cy)}
      >
        All
      </a>

      <a
        data-cy={FilterLink.Active}
        href="#/active"
        className={classNames(
          'filter__link',
          {
            selected: activeButton === 'active',
          },
        )}
        onClick={(event) => selectSort(event.currentTarget.dataset.cy)}
      >
        Active
      </a>
      <a
        data-cy={FilterLink.Completed}
        href="#/completed"
        className={classNames(
          'filter__link',
          {
            selected: activeButton === 'completed',
          },
        )}
        onClick={(event) => selectSort(event.currentTarget.dataset.cy)}
      >
        Completed
      </a>
    </nav>
  );
};
