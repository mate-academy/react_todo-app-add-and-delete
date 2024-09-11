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
        {Object.values(Filter).map(filterStatus => (
          <a
            key={filterStatus}
            href={`#/${filterStatus}`}
            className={classNames(
              'filter__link',
              filter === filterStatus && 'selected',
            )}
            data-cy={`FilterLink${filterStatus}`}
            onClick={() => {
              setFilter(filterStatus);
            }}
          >
            {filterStatus}
          </a>
        ))}
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
