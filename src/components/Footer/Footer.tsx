import { FC } from 'react';
import classNames from 'classnames';
import { SortType } from '../../types/Filter';

type Props = {
  sortType: SortType;
  activeItem: number;
  isCompleted: boolean;
  onSortChange: (sortType: SortType) => void;
  clearCompleted: () => void;
};

export const Footer: FC<Props> = ({
  sortType,
  activeItem,
  isCompleted,
  onSortChange,
  clearCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${activeItem} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={classNames(
            'filter__link',
            { selected: sortType === SortType.All },
          )}
          onClick={() => onSortChange(SortType.All)}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={classNames(
            'filter__link',
            { selected: sortType === SortType.Active },
          )}
          onClick={() => onSortChange(SortType.Active)}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={classNames(
            'filter__link',
            { selected: sortType === SortType.Completed },
          )}
          onClick={() => onSortChange(SortType.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        onClick={clearCompleted}
      >
        {isCompleted && 'Clear completed'}
      </button>
    </footer>
  );
};
