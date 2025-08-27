import '../../styles/todo.scss';
import { Todo } from '../../types/Todo';
import cn from 'classnames';

type Props = {
  todo: Todo;
  onClickDeleteTodo: (todoId: number) => void;
  listDeleteTodoId: number[];
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onClickDeleteTodo,
  listDeleteTodoId,
}) => {
  return (
    <>
      <div
        data-cy="Todo"
        className={cn('todo', { completed: todo.completed === true })}
      >
        <label htmlFor={`${todo.id}`} className="todo__status-label">
          <input
            id={`${todo.id}`}
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={todo.completed}
            onChange={() => {}}
            aria-label="Mark todo as completed"
          />
        </label>

        <span data-cy="TodoTitle" className="todo__title">
          {todo.title}
        </span>

        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => {
            onClickDeleteTodo(todo.id);
          }}
        >
          ×
        </button>
        <div
          data-cy="TodoLoader"
          className={cn('modal', 'overlay', {
            'is-active': listDeleteTodoId.includes(todo.id),
          })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </>
  );
};
