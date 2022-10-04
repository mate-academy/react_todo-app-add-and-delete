import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { SortTypes } from '../../types/SortTypes';

  type Props = {
    filteredTodos: Todo[]
    handleSortType: (type: string) => void
    sortType: string
    clearTable: () => void
  };

export const Footer: React.FC<Props> = ({
  handleSortType,
  sortType,
  filteredTodos,
  clearTable,
}) => {
  const completedTodosLen = filteredTodos
    .filter(todo => todo.completed === true).length === 0;

  const unCompletedTodosLen = filteredTodos
    .filter(todo => todo.completed === false).length;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {/* тут надо поминять только на те что неокончены  */}
        {/* {`${filteredTodos.filter(todo => todo.completed === false).length} items left`} */}
        {/* {`${filteredTodos.length} items left`} */}
        {`${unCompletedTodosLen} items left`}
      </span>
      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={classNames('filter__link', {
            selected: sortType === SortTypes.All,
          })}
          onClick={() => handleSortType(SortTypes.All)}
        >
          {SortTypes.All}
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={classNames('filter__link', {
            selected: sortType === SortTypes.Active,
          })}
          onClick={() => handleSortType(SortTypes.Active)}
        >
          {SortTypes.Active}
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={classNames('filter__link', {
            selected: sortType === SortTypes.Completed,
          })}
          onClick={() => handleSortType(SortTypes.Completed)}
        >
          {SortTypes.Completed}
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className={classNames('todoapp__clear-completed', {
          'is-invisible': completedTodosLen,
        })}
        onClick={clearTable}
      >
        Clear completed
      </button>
    </footer>
  );
};
