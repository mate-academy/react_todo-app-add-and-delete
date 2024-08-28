import classNames from 'classnames';
import { Filter } from '../utils/Filter';

type Props = {
  setFilter: (value: Filter) => void;
  activeTodosCount: number;
  filter: Filter;
  haveCompleted: boolean;
  handleDeleteCompletedTodos: () => void;
};

export const TodoFooter: React.FC<Props> = ({
  setFilter,
  activeTodosCount,
  filter,
  haveCompleted,
  handleDeleteCompletedTodos,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeTodosCount} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames(
            'filter__link',
            filter === Filter.All && 'selected',
          )}
          data-cy="FilterLinkAll"
          onClick={() => {
            setFilter(Filter.All);
          }}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames(
            'filter__link',
            filter === Filter.Active && 'selected',
          )}
          data-cy="FilterLinkActive"
          onClick={() => {
            setFilter(Filter.Active);
          }}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames(
            'filter__link',
            filter === Filter.Completed && 'selected',
          )}
          data-cy="FilterLinkCompleted"
          onClick={() => {
            setFilter(Filter.Completed);
          }}
        >
          Completed
        </a>
      </nav>
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!haveCompleted}
        onClick={handleDeleteCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
