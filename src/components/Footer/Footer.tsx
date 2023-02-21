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
  const activeTodosAmount = todos.filter(todo => !todo.completed).length;
  const completedTodo = todos.filter(todo => todo.completed);

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${activeTodosAmount} items left`}
      </span>

      {/* Active filter should have a 'selected' class */}
      <nav className="filter">
        {Object.values(Status).map(item => {
          return (
            <a
              href={`#/${item}`}
              className={classNames(
                'filter__link', { selected: status === item },
              )}
              onClick={() => setStatus(item)}
            >
              {item}
            </a>
          );
        })}
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
