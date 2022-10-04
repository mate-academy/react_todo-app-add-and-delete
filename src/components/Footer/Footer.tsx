import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  sortBy: string;
  setSortBy: (object: string) => void;
  todos: Todo[] | null;
  deleteTodo: () => void;
  doneTodo: Todo[];
};

export const Footer: React.FC<Props> = ({
  sortBy,
  todos,
  setSortBy,
  deleteTodo,
  doneTodo,
}) => {
  const handleChangeSortBy = (filteredBy: string) => {
    setSortBy(filteredBy);
  };

  const filterByParam = (param: string) => {
    return sortBy === param;
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${todos?.length} items left`}

      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={classNames('filter__link',
            { selected: filterByParam('all') })}
          onClick={() => handleChangeSortBy('all')}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={classNames('filter__link',
            { selected: filterByParam('active') })}
          onClick={() => handleChangeSortBy('active')}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={classNames('filter__link',
            { selected: filterByParam('completed') })}
          onClick={() => handleChangeSortBy('completed')}
        >
          Completed
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        onClick={deleteTodo}
      >
        {doneTodo
          && doneTodo.length > 0 && 'Clear completed'}
      </button>
    </footer>
  );
};
