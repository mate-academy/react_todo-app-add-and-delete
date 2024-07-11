import { Status } from '../../types/Status';
import { useDispatch, useGlobalState } from '../../GlobalStateProvider';
import { Type } from '../../types/Action';
import { Todo } from '../../types/Todo';

type Props = {
  deleteTodosFromServer: (arg: Todo) => Promise<void>;
};

export const Footer: React.FC<Props> = ({ deleteTodosFromServer }) => {
  const { todos, status } = useGlobalState();
  const dispatch = useDispatch();

  const activeList = todos.filter(todo => !todo.completed);
  const completedList = todos.filter(todo => todo.completed);

  const shouldDisable = completedList.length ? false : true;

  const clearCompletedFromServer = () => {
    return completedList.forEach(todo => {
      dispatch({ type: Type.setDeletedTodos, payload: todo });
      deleteTodosFromServer(todo);
    });
  };

  if (!todos.length) {
    return null;
  }

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeList.length} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(Status).map(statusValue => (
          <a
            key={statusValue}
            href="#/"
            className={
              'filter__link ' + (status === statusValue ? 'selected' : '')
            }
            data-cy={
              'FilterLink' +
              statusValue.charAt(0).toUpperCase() +
              statusValue.slice(1)
            }
            onClick={() =>
              dispatch({ type: Type.setStatus, payload: statusValue })
            }
          >
            {statusValue}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={shouldDisable}
        onClick={clearCompletedFromServer}
      >
        Clear completed
      </button>
    </footer>
  );
};
