import classNames from 'classnames';
import { FilterType } from '../../types/Filter';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  onDelete: (id: number) => void;
  filterBy: string;
  changeFilter: (filter: FilterType) => void;
  loadingClearCompleted: boolean;
  setLoadingClearCompleted: (value: boolean) => void;
};

export const Footer: React.FC<Props> = ({
  todos,
  onDelete,
  filterBy,
  changeFilter,
  loadingClearCompleted,
  setLoadingClearCompleted,
}) => {
  const completedTodos = todos.filter(todo => todo.completed);
  const unComletedTodos = todos.filter(todo => !todo.completed);

  const handleDeleteCompleted = async () => {
    try {
      setLoadingClearCompleted(true);
      await Promise.all(completedTodos.map(todo => onDelete(todo.id)));
    } finally {
      setLoadingClearCompleted(false);
    }
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${unComletedTodos.length} items left`}
      </span>
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link',
            { selected: filterBy === 'all' })}
          data-cy="FilterLinkAll"
          onClick={() => changeFilter(FilterType.ALL)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link',
            { selected: filterBy === 'active' })}
          data-cy="FilterLinkActive"
          onClick={() => changeFilter(FilterType.ACTIVE)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link',
            { selected: filterBy === 'completed' })}
          data-cy="FilterLinkCompleted"
          onClick={() => changeFilter(FilterType.COMPLETED)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={handleDeleteCompleted}
      >
        {completedTodos.length > 0 || loadingClearCompleted
          ? 'Clear completed' : ''}
      </button>
    </footer>
  );
};
