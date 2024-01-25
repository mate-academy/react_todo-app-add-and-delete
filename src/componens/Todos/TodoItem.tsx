import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo
  deleteTodo(id: number): void;
};

export const TodoItem: React.FC<Props> = ({ todo, deleteTodo }) => {
  return (
    <div
      data-cy="Todo"
      key={todo.id}
      className={classNames('todo', { completed: !!todo.completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={!!todo.completed}
        />
      </label>

      <span
        data-cy="TodoTitle"
        className="todo__title"
      >
        {todo.title}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => deleteTodo(todo.id)}
      >
        ×
      </button>

      {/* 'is-active' class puts this modal on top of the todo */}
      <div
        data-cy="TodoLoader"
        className={
          classNames('modal overlay',
            { 'is-active': todo.id === 0 })
        }
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
