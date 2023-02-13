import cn from 'classnames';
import { TempTodo, Todo } from '../../types/Todo';

type Props = {
  todo: Todo | TempTodo;
  deleteTodo?: (id: number) => void;
};

export const TodoContent:React.FC<Props> = ({
  todo,
  deleteTodo,
}) => {
  return (
    <div
      data-cy="Todo"
      className={cn('todo',
        { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
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
        data-cy="TodoDeleteButton"
        onClick={() => {
          if (deleteTodo) {
            deleteTodo(todo.id);
          }
        }}
      >
        ×
      </button>
      <div data-cy="TodoLoader" className="modal overlay">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>

    </div>

  );
};
