import classNames from 'classnames';
import { Etodos } from '../../types/enum';
import { Todo } from '../../types/Todo';

type Props = {
  isUncomplete: number;
  sortTodosBy: Etodos;
  setSortTodosBy: (arg: Etodos) => void;
  todos: Todo[];
  deleteCompletedTodo: () => void
};

export const Footer: React.FC<Props> = ({
  isUncomplete,
  sortTodosBy,
  setSortTodosBy,
  todos,
  deleteCompletedTodo,
}) => {
  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${isUncomplete} item${isUncomplete === 1 ? '' : 's'} left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: sortTodosBy === Etodos.ALL,
          })}
          onClick={() => setSortTodosBy(Etodos.ALL)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: sortTodosBy === Etodos.ACTIVE,
          })}
          onClick={() => setSortTodosBy(Etodos.ACTIVE)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: sortTodosBy === Etodos.COMPLETED,
          })}
          onClick={() => setSortTodosBy(Etodos.COMPLETED)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className={classNames('todoapp__clear-completed', {
          'is-invisible': isUncomplete === todos.length,
        })}
        disabled={isUncomplete === todos.length}
        onClick={deleteCompletedTodo}
      >
        Clear completed
      </button>
    </footer>
  );
};
