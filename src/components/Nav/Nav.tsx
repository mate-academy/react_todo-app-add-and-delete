import { FC } from 'react';
import cn from 'classnames';
import { SortTypes } from '../../types/SortTypes';

interface Props {
  onChangeFilter: (filter: SortTypes) => void;
  activeFilter: SortTypes;
  onClearCompletedTodos: () => void;
}

export const Nav: FC<Props> = ({
  onChangeFilter,
  activeFilter,
  onClearCompletedTodos,
}) => {
  const handleFilter = (filter: SortTypes) => {
    onChangeFilter(filter);
  };

  return (
    <>
      <nav className="filter">
        <a
          href="#/"
          className={cn('filter__link',
            { selected: activeFilter === SortTypes.All })}
          onClick={() => handleFilter(SortTypes.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link',
            { selected: activeFilter === SortTypes.Active })}
          onClick={() => handleFilter(SortTypes.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link',
            { selected: activeFilter === SortTypes.Completed })}
          onClick={() => handleFilter(SortTypes.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        onClick={onClearCompletedTodos}
      >
        Clear completed
      </button>

    </>
  );
};
