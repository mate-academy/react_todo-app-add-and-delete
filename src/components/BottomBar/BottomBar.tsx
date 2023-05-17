import classNames from 'classnames';
import { FC, memo } from 'react';
import { Filter } from '../../types/FilterEnum';

interface Props {
  itemsCount: number;
  selectedFilter: Filter;
  showClearAllButton: boolean;
  onChange: (filter: Filter) => void;
  deleteAllCompleted: () => void;
}

export const BottomBar: FC<Props> = memo(({
  itemsCount,
  selectedFilter,
  showClearAllButton,
  onChange,
  deleteAllCompleted,
}) => {
  const handleClick = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  ) => {
    const target = event.target as HTMLAnchorElement;

    onChange(target.text as Filter);
  };

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${itemsCount} items left`}
      </span>
      <nav className="filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: selectedFilter === Filter.All,
          })}
          onClick={handleClick}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: selectedFilter === Filter.Active,
          })}
          onClick={handleClick}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: selectedFilter === Filter.Completed,
          })}
          onClick={handleClick}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        style={{ display: showClearAllButton ? undefined : 'none' }}
        onClick={() => deleteAllCompleted()}
      >
        Clear completed
      </button>
    </footer>
  );
});
