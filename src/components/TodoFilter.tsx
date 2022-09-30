import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  setFilterType: (filterType: FilterBy) => void;
  filterType: FilterBy;
  onDelete: (id: number) => void;
};

export enum FilterBy {
  All,
  Active,
  Completed,
}

export const TodoFilter: React.FC<Props> = ({
  todos, filterType, setFilterType, onDelete,
}) => {
  const { length } = todos.filter((todo) => todo.completed === false);

  const completedTodos = todos.some((todo) => todo.completed === true);

  const completed = todos.filter((todo) => todo.completed === true);

  const handleAllSort = () => setFilterType(FilterBy.All);
  const handleActiveSort = () => setFilterType(FilterBy.Active);
  const handleCompletedSort = () => setFilterType(FilterBy.Completed);

  return (
    <>
      <span className="todo-count" data-cy="todosCounter">
        {`${length} items left`}
      </span>
      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={classNames(
            'filter__link',
            { selected: filterType === FilterBy.All },
          )}
          onClick={handleAllSort}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={classNames(
            'filter__link',
            { selected: filterType === FilterBy.Active },
          )}
          onClick={handleActiveSort}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={classNames(
            'filter__link',
            { selected: filterType === FilterBy.Completed },
          )}
          onClick={handleCompletedSort}
        >
          Completed
        </a>
      </nav>
      {completedTodos
        ? (
          <button
            data-cy="ClearCompletedButton"
            type="button"
            className="todoapp__clear-completed"
            onClick={() => completed.every((todo) => {
              if (todo.completed === true) {
                return onDelete(todo.id);
              }

              return 0;
            })}
          >
            Clear completed
          </button>
        )
        : (
          <button
            data-cy="ClearCompletedButton"
            type="button"
            className="todoapp__clear-completed"
            style={{ visibility: 'hidden' }}
          >
            Clear completed
          </button>
        )}

    </>
  );
};
