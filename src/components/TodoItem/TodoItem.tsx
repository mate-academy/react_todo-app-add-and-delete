import { FC, memo } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo;
  deleteTodo: (todoId: number) => void;
}

export const TodoItem: FC<Props> = memo(({
  todo,
  deleteTodo,
}) => (
  <div
    className={classNames('todo', {
      completed: todo.completed,
    })}
  >
    <label className="todo__status-label">
      <input
        type="checkbox"
        className="todo__status"
      />
    </label>

    <span className="todo__title">{todo.title}</span>

    {/* Remove button appears only on hover */}
    <button
      type="button"
      className="todo__remove"
      onClick={() => deleteTodo(todo.id)}
    >
      ×
    </button>

    {/* overlay will cover the todo while it is being updated */}
    <div className="modal overlay">
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  </div>
));
