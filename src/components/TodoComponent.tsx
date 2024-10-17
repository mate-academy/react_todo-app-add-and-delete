/* eslint-disable jsx-a11y/label-has-associated-control */
import classNames from 'classnames';
import { Todo } from '../types/Todo';

interface TodoComponentProps {
  todo: Todo;
  isLoading: boolean;
  tempTodo: Todo | null;
  onTodoDelete: (todoId: number) => void;
  onTodoToggle: (todoId: number, currentCompletedStatus: boolean) => void;
}

export const TodoComponent: React.FC<TodoComponentProps> = ({
  todo,
  isLoading,
  tempTodo,
  onTodoDelete,
  onTodoToggle,
}) => {
  const isTempTodo = tempTodo && tempTodo.id === todo.id;

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
      key={todo.id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          disabled={isTempTodo || isLoading}
          onChange={() => onTodoToggle(todo.id, todo.completed)}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        disabled={isTempTodo || isLoading}
        onClick={() => onTodoDelete(todo.id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
