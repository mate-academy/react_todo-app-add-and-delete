/* eslint-disable jsx-a11y/label-has-associated-control */
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { TodoTitle } from './TodoTitle';

interface Props {
  todo: Todo;
  onDelete: (todoId: number) => void;
  onTodoStatusChange: (todoId: number) => void;
  isLoading?: boolean;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete,
  onTodoStatusChange,
  isLoading = false,
}) => {
  return (
    <div
      key={todo.id}
      className={`todo ${todo.completed ? 'completed' : ''}`}
      data-cy="Todo"
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => onTodoStatusChange(todo.id)}
          disabled={isLoading}
        />
      </label>

      <TodoTitle todo={todo} onDelete={onDelete} />

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', { 'is-active': isLoading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
