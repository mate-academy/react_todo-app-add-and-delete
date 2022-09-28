import classnames from 'classnames';
import { FilterType } from '../../types/FilterStatus';
import { Todo } from '../../types/Todo';

type Props = {
  filterType: string;
  handleFilterType: (type: string) => void;
  todos: Todo[];
};

export const Footer: React.FC<Props> = ({
  filterType,
  handleFilterType,
  todos,
}) => {
  const todosLeft = todos.filter(todo => !todo.completed).length;
  const todosCompleted = todos.filter(todo => todo.completed).length;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${todosLeft} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={classnames(
            'filter__link',
            { selected: filterType === FilterType.All },
          )}
          onClick={() => handleFilterType(FilterType.All)}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={classnames(
            'filter__link',
            { selected: filterType === FilterType.Active },
          )}
          onClick={() => handleFilterType(FilterType.Active)}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={classnames(
            'filter__link',
            { selected: filterType === FilterType.Completed },
          )}
          onClick={() => handleFilterType(FilterType.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
      >
        {todosCompleted > 0 && 'Clear completed'}
      </button>
    </footer>
  );
};
