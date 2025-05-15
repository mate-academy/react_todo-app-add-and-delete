/* eslint-disable jsx-a11y/label-has-associated-control */
import { Todo } from '../../types/Todo';
import cn from 'classnames';

interface Props {
  todo: Todo;
  onInputChange: () => void;
  onDelete: (todoId: number) => void;
  deletedTodoId: number[];
}

export const TodoItem = ({
  todo,
  onInputChange,
  onDelete,
  deletedTodoId,
}: Props) => (
  <div
    key={todo.id}
    data-cy="Todo"
    className={cn('todo item-enter-done', { completed: todo.completed })}
  >
    <label className="todo__status-label">
      <input
        data-cy="TodoStatus"
        type="checkbox"
        className="todo__status"
        checked={todo.completed}
        onChange={onInputChange}
      />
    </label>

    {todo.title ? (
      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>
    ) : (
      <form>
        <input
          data-cy="TodoTitleField"
          type="text"
          className="todo__title-field"
          placeholder="Empty todo will be deleted"
          value="Todo is being edited now"
        />
      </form>
    )}

    <button
      type="button"
      className="todo__remove"
      data-cy="TodoDelete"
      onClick={() => onDelete(todo.id)}
    >
      ×
    </button>

    <div
      data-cy="TodoLoader"
      className={cn('modal overlay', {
        'is-active': deletedTodoId.includes(todo.id),
      })}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  </div>
);
