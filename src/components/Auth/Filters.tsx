import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  setFilterBy: (object: string) => void;
  filterBy: string;
  todos: Todo[] | null;
  deleteTodo: () => void
  completedTodos: Todo[];
};

export const Filter: React.FC<Props> = ({
  filterBy,
  todos,
  setFilterBy,
  deleteTodo,
  completedTodos,
}) => {
  const handleChangeFilterBy = (filteredBy: string) => {
    setFilterBy(filteredBy);
  };

  const filterByParam = (param: string) => {
    return filterBy === param;
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
          onClick={() => handleChangeFilterBy('all')}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={classNames('filter__link',
            { selected: filterByParam('active') })}
          onClick={() => handleChangeFilterBy('active')}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={classNames('filter__link',
            { selected: filterByParam('completed') })}
          onClick={() => handleChangeFilterBy('completed')}
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
        {completedTodos.length > 0 && ('Clear completed')}
      </button>
    </footer>
  );
};
