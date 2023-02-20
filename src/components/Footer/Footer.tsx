import classNames from 'classnames';
import { Status } from '../../types/Status';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[]
  status: Status
  setStatus: (status: Status) => void;
  handleDeleteCompletedTodos: () => void;
};
export const Footer:React.FC<Props> = ({
  todos,
  status,
  setStatus,
  handleDeleteCompletedTodos,
}) => {
  const todoLeft = todos.filter(todo => !todo.completed).length;
  const completedTodo = todos.filter(todo => todo.completed);

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${todoLeft} items left`}
      </span>

      {/* Active filter should have a 'selected' class */}
      <nav className="filter">
        <a
          href="#/"
          className={classNames(
            'filter__link', { selected: status === Status.All },
          )}
          onClick={() => setStatus(Status.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames(
            'filter__link', { selected: status === Status.Active },
          )}
          onClick={() => setStatus(Status.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames(
            'filter__link', { selected: status === Status.Completed },
          )}
          onClick={() => setStatus(Status.Completed)}
        >
          Completed
        </a>
      </nav>

      {/* don't show this button if there are no completed todos */}
      {completedTodo.length > 0
       && (
         <button
           type="button"
           className="todoapp__clear-completed"
           onClick={handleDeleteCompletedTodos}
         >
           Clear completed
         </button>
       )}
    </footer>
  );
};
