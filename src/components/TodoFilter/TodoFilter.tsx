import { FC } from 'react';
import classNames from 'classnames';
import { StatusToFilter } from '../../types/Todo';

type Props = {
  statusToFilter: StatusToFilter;
  setStatusToFilter: (filterType: StatusToFilter) => void
  onClearCompleted: () => void;
  amountOfActiveTodos: number;
  amoutOfCompletedTodos: number;
};

export const TodoFilter: FC<Props> = ({
  statusToFilter,
  setStatusToFilter,
  onClearCompleted,
  amountOfActiveTodos,
  amoutOfCompletedTodos,
}) => {
  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${amountOfActiveTodos} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: statusToFilter === StatusToFilter.All,
          })}
          onClick={() => setStatusToFilter(StatusToFilter.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: statusToFilter === StatusToFilter.Active,
          })}
          onClick={() => setStatusToFilter(StatusToFilter.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: statusToFilter === StatusToFilter.Completed,
          })}
          onClick={() => setStatusToFilter(StatusToFilter.Completed)}
        >
          Completed
        </a>
      </nav>
      {amoutOfCompletedTodos > 0 && (
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
