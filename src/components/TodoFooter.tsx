import classNames from 'classnames';
import { FilterStatus } from '../types/Todo';

type Props = {
  filterStatus: string;
  setFilterStatus: (status: FilterStatus) => void;
  todosLenght: number;
  isClearButtonDisabled: boolean;
  onClearCompleted: () => void;
};

export const TodoFooter: React.FC<Props> = ({
  filterStatus,
  setFilterStatus,
  todosLenght,
  isClearButtonDisabled,
  onClearCompleted,
}) => {
  const clickHandlerCompleted = () => {
    setFilterStatus(FilterStatus.COMPLETED);
  };

  const clickHandlerAll = () => {
    setFilterStatus(FilterStatus.ALL);
  };

  const clickHandlerActive = () => {
    setFilterStatus(FilterStatus.ACTIVE);
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todosLenght} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames(
            'filter__link',
            filterStatus === FilterStatus.ALL && 'selected',
          )}
          data-cy="FilterLinkAll"
          onClick={clickHandlerAll}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames(
            'filter__link',
            filterStatus === FilterStatus.ACTIVE && 'selected',
          )}
          data-cy="FilterLinkActive"
          onClick={clickHandlerActive}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames(
            'filter__link',
            filterStatus === FilterStatus.COMPLETED && 'selected',
          )}
          data-cy="FilterLinkCompleted"
          onClick={clickHandlerCompleted}
        >
          Completed
        </a>
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={isClearButtonDisabled}
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
