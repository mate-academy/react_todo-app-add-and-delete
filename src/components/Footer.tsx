import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { Filter } from '../types/Filter';

type Props = {
  filter: string,
  onSetFilter: (filter: Filter) => void,
  completedTodos: Todo[],
  onRemoveAll: (userId: number) => void,
  activeTodos: Todo[];
};

export const Footer: React.FC<Props> = ({
  filter,
  onSetFilter,
  completedTodos,
  onRemoveAll,
  activeTodos,
}) => (
  <footer className="todoapp__footer">
    <span className="todo-count">
      {`${activeTodos.length} items left`}
    </span>

    <nav className="filter">
      <a
        href="#/"
        className={classNames(
          'filter__link',
          {
            selected: filter === 'all',
          },
        )}
        onClick={() => onSetFilter(Filter.ALL)}
      >
        All
      </a>

      <a
        href="#/active"
        className={classNames(
          'filter__link',
          {
            selected: filter === 'active',
          },
        )}
        onClick={() => onSetFilter(Filter.ACTIVE)}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={classNames(
          'filter__link',
          {
            selected: filter === 'completed',
          },
        )}
        onClick={() => onSetFilter(Filter.COMPLETED)}
      >
        Completed
      </a>
    </nav>

    <button
      type="button"
      className="todoapp__clear-completed"
      disabled={completedTodos.length === 0}
      onClick={() => {
        completedTodos.forEach(todo => {
          onRemoveAll(todo.id)
        })
      }}
    >
      Clear completed
    </button>
  </footer>
)
