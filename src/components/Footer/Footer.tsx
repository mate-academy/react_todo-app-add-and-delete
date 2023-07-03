import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { TodoStatus } from '../../types/TodoStatus';

type Props = {
  visibleTodos: Todo[] | null,
  filter: string,
  setFilter: (status: TodoStatus) => void,
  completedTodos: Todo[],
  handleRemoveCompleted: () => void,
};

export const Footer: React.FC<Props> = ({
  visibleTodos,
  filter,
  setFilter,
  completedTodos,
  handleRemoveCompleted,
}) => (
  <footer className="todoapp__footer">
    <span className="todo-count">
      {visibleTodos?.length === 1
        ? `${visibleTodos.length} item left`
        : `${visibleTodos?.length} items left`}
    </span>

    <nav className="filter">
      <a
        href="#/"
        className={cn('filter__link', {
          selected: filter === TodoStatus.ALL,
        })}
        onClick={() => setFilter(TodoStatus.ALL)}
      >
        All
      </a>

      <a
        href="#/active"
        className={cn('filter__link', {
          selected: filter === TodoStatus.ACTIVE,
        })}
        onClick={() => setFilter(TodoStatus.ACTIVE)}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={cn('filter__link', {
          selected: filter === TodoStatus.COMPLETED,
        })}
        onClick={() => setFilter(TodoStatus.COMPLETED)}
      >
        Completed
      </a>
    </nav>

    <button
      type="button"
      className={cn('todoapp__clear-completed', {
        hidden: completedTodos.length === 0,
      })}
      onClick={handleRemoveCompleted}
    >
      Clear completed
    </button>
  </footer>
);
