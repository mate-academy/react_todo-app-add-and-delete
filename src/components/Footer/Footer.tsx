import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { TodoStatus } from '../../types/TodoStatus';

type Props = {
  activeTodos: Todo[] | null,
  filter: string,
  setFilter: (status: TodoStatus) => void,
  completedTodos: Todo[],
  handleRemoveCompleted: () => void,
};

export const Footer: React.FC<Props> = ({
  activeTodos,
  filter,
  setFilter,
  completedTodos,
  handleRemoveCompleted,
}) => (
  <footer className="todoapp__footer">
    <span className="todo-count">
      {activeTodos?.length === 1
        ? `${activeTodos.length} item left`
        : `${activeTodos?.length} items left`}
    </span>

    <nav className="filter">
      <a
        href="#/"
        className={cn('filter__link', {
          selected: filter === TodoStatus.all,
        })}
        onClick={() => setFilter(TodoStatus.all)}
      >
        All
      </a>

      <a
        href="#/active"
        className={cn('filter__link', {
          selected: filter === TodoStatus.active,
        })}
        onClick={() => setFilter(TodoStatus.active)}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={cn('filter__link', {
          selected: filter === TodoStatus.completed,
        })}
        onClick={() => setFilter(TodoStatus.completed)}
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
