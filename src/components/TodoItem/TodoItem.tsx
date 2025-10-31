/* eslint-disable jsx-a11y/label-has-associated-control */
import { Todo } from '../../types/Todo';
import cn from 'classnames';
import { Loader } from '../Loader/Loader';

type TodoItemProps = {
  todo: Todo;
  onCompletedChange: (todoId: Todo['id']) => void;
  onDelete: (todoId: Todo['id']) => void;
  isLoading: boolean;
};
export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onCompletedChange,
  onDelete,
  isLoading,
}) => {
  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
      <label className="todo__status-label" htmlFor={`todo-${todo.id}`}>
        <input
          id={`todo-${todo.id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => onCompletedChange(todo?.id)}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => onDelete(todo.id)}
      >
        ×
      </button>
      <Loader isLoading={isLoading} />
    </div>
  );
};
