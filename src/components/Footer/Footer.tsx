import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { SortTypes } from '../../types/SortTypes';

  type Props = {
    todos: Todo[]
    handleSortType: (type: string) => void,
    sortType: string
  };

export const Footer: React.FC<Props> = ({
  todos,
  handleSortType,
  sortType,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${todos.filter(todo => todo.completed === false).length} items left`}
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
        className="todoapp__clear-completed"
      >
        Clear completed
      </button>
    </footer>
  );
};
