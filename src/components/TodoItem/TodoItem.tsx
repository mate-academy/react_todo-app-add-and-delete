/* eslint-disable @typescript-eslint/no-explicit-any */
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo,
  removeTodo: (todoId: number) => Promise<any>,
}

export const TodoItem: React.FC<Props> = ({ todo, removeTodo }) => {
  return (
    <div className={classNames('todo', {
      completed: todo.completed,
    })}
    >
      <label className="todo__status-label">
        <input
          checked={todo.completed}
          type="checkbox"
          className="todo__status"
        />
      </label>

      <span className="todo__title">{todo.title}</span>
      <button
        type="button"
        className="todo__remove"
        onClick={() => removeTodo(todo.id)}
      >
        ×
      </button>

      <div className="modal overlay">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>

  );
};
