import classNames from 'classnames';
import { Todo } from '../../../types/Todo';

type Props = {
  todo: Todo;
  handleCheckTodo: (id: number) => void;
  handleDeleteTodos: (todoId: number) => void;
  isLoadingTodos: boolean;
  isLoadingDelete: number | null;
  isLoadingAdd: boolean;
};

export const TodoInfo = ({
  todo,
  handleCheckTodo,
  handleDeleteTodos,
  isLoadingTodos,
  isLoadingDelete,
  isLoadingAdd,
}: Props) => {
  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => handleCheckTodo(todo.id)}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => handleDeleteTodos(todo.id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active':
            isLoadingTodos ||
            (todo.id === 0 && isLoadingAdd) ||
            todo.id === isLoadingDelete,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
