import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { Filter } from '../../types/Filter';

type Props = {
  setFilter: (str: string) => void,
  todos: Todo[],
  filter: string,
};

export const Footer: React.FC<Props> = ({
  setFilter,
  todos,
  filter,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${todos.length} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={classNames(
            'filter__link', { selected: filter === Filter.ALL },
          )}
          onClick={() => setFilter(Filter.ALL)}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={classNames(
            'filter__link active', { selected: filter === 'active' },
          )}
          onClick={() => setFilter(Filter.ACTIVE)}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={classNames(
            'filter__link', { selected: filter === Filter.COMPLETED },
          )}
          onClick={() => setFilter(Filter.COMPLETED)}
        >
          Completed
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
