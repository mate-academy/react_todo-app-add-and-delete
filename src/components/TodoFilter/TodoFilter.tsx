import React from 'react';
import classNames from 'classnames';

export enum StatusOfFilter {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}

type Props = {
  setFilter: React.Dispatch<React.SetStateAction<StatusOfFilter>>;
  filter: StatusOfFilter;
};

export const TodoFilter: React.FC<Props> = ({ filter, setFilter }) => {
  const handleAllClick = () => setFilter(StatusOfFilter.All);
  const handleActiveClick = () => setFilter(StatusOfFilter.Active);
  const handleCompletedClick = () => setFilter(StatusOfFilter.Completed);

  return (
    <nav className="filter">
      <a
        href="#/"
        className={classNames('filter__link',
          { selected: filter === StatusOfFilter.All })}
        onClick={handleAllClick}
      >
        All
      </a>

      <a
        href="#/active"
        className={classNames('filter__link',
          { selected: filter === StatusOfFilter.Active })}
        onClick={handleActiveClick}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={classNames('filter__link',
          { selected: filter === StatusOfFilter.Completed })}
        onClick={handleCompletedClick}
      >
        Completed
      </a>
    </nav>
  );
};
