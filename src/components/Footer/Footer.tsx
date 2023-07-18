import classNames from 'classnames';
import { Etodos } from '../../types/enum';
import { Todo } from '../../types/Todo';
import { deleteTodoOnServer, getTodos } from '../../api';

type Props = {
  isUncomplete: number;
  sortTodosBy: Etodos;
  setSortTodosBy: (arg: Etodos) => void;
  todos: Todo[];
  setTodos: (arg: Todo[]) => void;
  checkCompletedTodo: (arg: Todo[]) => void;
  setIsShowFooter: (arg: boolean) => void;
  userID: number;
};

export const Footer: React.FC<Props> = ({
  isUncomplete,
  sortTodosBy,
  setSortTodosBy,
  todos,
  setTodos,
  checkCompletedTodo,
  setIsShowFooter,
  userID,
}) => {
  const deleteCompleted = () => {
    getTodos(userID, 'completed=true')
      .then((todoList) => {
        return Promise.all(
          todoList.map((todo: Todo) => deleteTodoOnServer(todo.id)),
        );
      })
      .then(() => getTodos(userID))
      .then((todoList) => {
        setTodos(todoList);
        checkCompletedTodo(todoList);
        setIsShowFooter(Boolean(todoList.length));
      })
      .catch((error) => new Error(error.message));
  };

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
        onClick={deleteCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
