import classNames from 'classnames';
import { FC } from 'react';
import { FilterType } from '../../enums/FilterType';

type Props = {
  filterType: FilterType;
  changeFilterType: (filterType: FilterType) => void;
  onClearCompleted: () => void;
  todosLeft: number;
  completedTodosCount: number;
};

export const TodoFilter: FC<Props> = ({
  filterType,
  changeFilterType,
  onClearCompleted,
  todosLeft,
  completedTodosCount,
}) => {
  return (
    <footer className="todoapp__footer">
      <span className="todo-count">{`${todosLeft} items left`}</span>

      <nav className="filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filterType === FilterType.All,
          })}
          onClick={() => changeFilterType(FilterType.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filterType === FilterType.Active,
          })}
          onClick={() => changeFilterType(FilterType.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filterType === FilterType.Completed,
          })}
          onClick={() => changeFilterType(FilterType.Completed)}
        >
          Completed
        </a>
      </nav>

      {completedTodosCount > 0 && (
        <button
          type="button"
          className="todoapp__clear-completed"
          onClick={onClearCompleted}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
