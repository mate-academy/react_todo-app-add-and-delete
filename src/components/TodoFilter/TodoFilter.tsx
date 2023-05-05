import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { StatusTodos } from '../../types/StatusTodo';

type Props = {
  visibleTodos: Todo[];
  status: string,
  onStatusChange: (value: StatusTodos) => void;
  onChangeTodo: (value: Todo[]) => void;
};

export const TodoFilter: React.FC<Props> = ({
  visibleTodos,
  status,
  onStatusChange,
  onChangeTodo,
}) => {
  const activeTodos = visibleTodos.filter(todo => !todo.completed).length;
  const completedTodos = visibleTodos.filter(todo => todo.completed);

  const handleClearCompleted = () => {
    onChangeTodo(visibleTodos.filter(todo => !todo.completed));
  };

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${activeTodos} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: status === StatusTodos.ALL,
          })}
          onClick={() => onStatusChange(StatusTodos.ALL)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: status === StatusTodos.ACTIVE,
          })}
          onClick={() => onStatusChange(StatusTodos.ACTIVE)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: status === StatusTodos.COMPLETED,
          })}
          onClick={() => onStatusChange(StatusTodos.COMPLETED)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        onClick={handleClearCompleted}
        disabled={!completedTodos.length}
      >
        {completedTodos.length > 0 ? 'Clear completed' : ''}
      </button>

    </footer>
  );
};
