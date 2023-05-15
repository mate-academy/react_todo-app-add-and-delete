import classNames from 'classnames';
import { FC, memo } from 'react';
import { Filter } from '../../types/FilterEnum';

interface BottomPanelProps {
  countOfItems: number;
  selectedFilter: Filter;
  showClearAllButton: boolean;
  changeFilterOfTodo: (filter: Filter) => void;
  deleteAllCompleted: () => void;
}

export const BottomPanel: FC<BottomPanelProps> = memo(({
  countOfItems,
  selectedFilter,
  showClearAllButton,
  changeFilterOfTodo,
  deleteAllCompleted,
}) => {
  const handleClick = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  ) => {
    const target = event.target as HTMLAnchorElement;

    changeFilterOfTodo(target.text as Filter);
  };

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${countOfItems} items left`}
      </span>
      <nav className="filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: selectedFilter === Filter.ALL,
          })}
          onClick={handleClick}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: selectedFilter === Filter.ACTIVE,
          })}
          onClick={handleClick}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: selectedFilter === Filter.COMPLETED,
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
