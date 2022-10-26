import classNames from 'classnames';
import { FilterBy } from '../../types/FilterType';
import { Todo } from '../../types/Todo';

type Props = {
  sortBy: FilterBy;
  setSortBy: (value: FilterBy) => void;
  clearAllCompleted: () => void;
  completedTodo: Todo[];
};

export const TodoFilter: React.FC<Props> = ({
  sortBy,
  setSortBy,
  clearAllCompleted,
  completedTodo,
}) => {
  return (
    <>
      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={classNames('filter__link',
            { 'filter__link selected': sortBy === FilterBy.All })}
          onClick={() => {
            setSortBy(FilterBy.All);
          }}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={classNames('filter__link',
            { 'filter__link selected': sortBy === FilterBy.Active })}
          onClick={() => {
            setSortBy(FilterBy.Active);
          }}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={classNames('filter__link',
            { 'filter__link selected': sortBy === FilterBy.Completed })}
          onClick={() => {
            setSortBy(FilterBy.Completed);
          }}
        >
          Completed
        </a>
      </nav>
      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        onClick={clearAllCompleted}
        disabled={completedTodo.length === 0}
      >
        Clear completed
      </button>
    </>
  );
};
