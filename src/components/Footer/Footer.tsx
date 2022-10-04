import classNames from 'classnames';
import { SortType } from '../../types/SortType';

type Props = {
  activeTodosCount: number;
  completedTodosCount: number;
  sortType: SortType;
  onSortType: (sortType: SortType) => void;
  onRemoveCompletedTodos: () => void;
};

export const Footer: React.FC<Props> = (props) => {
  const {
    activeTodosCount,
    sortType,
    onSortType,
    onRemoveCompletedTodos,
    completedTodosCount,
  } = props;

  const handleSortType = (type: SortType) => {
    onSortType(type);
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${activeTodosCount} items left`}
      </span>
      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={classNames(
            'filter__link',
            { selected: sortType === SortType.all },
          )}
          onClick={() => handleSortType(SortType.all)}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={classNames(
            'filter__link',
            { selected: sortType === SortType.active },
          )}
          onClick={() => handleSortType(SortType.active)}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={classNames(
            'filter__link',
            { selected: sortType === SortType.completed },
          )}
          onClick={() => handleSortType(SortType.completed)}
        >
          Completed
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        onClick={onRemoveCompletedTodos}
        style={completedTodosCount
          ? undefined
          : { visibility: 'hidden' }}
      >
        Clear completed
      </button>
    </footer>
  );
};
