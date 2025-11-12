/* eslint-disable jsx-a11y/label-has-associated-control */
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  loadingTodos: Todo['id'][];
  onHandleDeleteTodo: (todoId: Todo['id']) => void;
};

export const TodoInfo: React.FC<Props> = ({
  todo,
  loadingTodos,
  onHandleDeleteTodo,
}) => {
  return (
    <div
      key={todo.id}
      data-cy="Todo"
      className={cn('todo', { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => onHandleDeleteTodo(todo.id)}
      >
        ×
      </button>
      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': loadingTodos.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
