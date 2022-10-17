import { FC } from 'react';
import classNames from 'classnames';
import { FiltType } from '../../types/Filter';

type Props = {
  filtType: FiltType;
  activeItem: number;
  isCompleted: boolean;
  onSortChange: (filtType: FiltType) => void;
  clearCompleted: () => void;
};

export const Filter: FC<Props> = ({
  filtType,
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
            { selected: filtType === FiltType.All },
          )}
          onClick={() => onSortChange(FiltType.All)}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={classNames(
            'filter__link',
            { selected: filtType === FiltType.Active },
          )}
          onClick={() => onSortChange(FiltType.Active)}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={classNames(
            'filter__link',
            { selected: filtType === FiltType.Completed },
          )}
          onClick={() => onSortChange(FiltType.Completed)}
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
