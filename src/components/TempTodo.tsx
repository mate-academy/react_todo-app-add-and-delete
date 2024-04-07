/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable */
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  deleteTodos: (todoId: number) => void;
};

export const TempTodo: React.FC<Props> = ({
  todo,
  deleteTodos,
 }) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {/* This is a completed todo */}
      <div
        key={todo.id}
        data-cy="Todo"
        className={`todo ${todo.completed ? 'completed' : ''}`}
      >
        <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={todo.completed}
              onChange={() => {}}
            />
          </label>
          <span data-cy="TodoTitle" className="todo__title">
            {todo.title}
          </span>

        {/* Remove button appears only on hover */}
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => deleteTodos(todo.id)}
        >
          ×
        </button>

          {/* overlay will cover the todo while it is being deleted or updated */}
          <div
            data-cy="TodoLoader"
          className="modal overlay is-active"
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
      </div>

    </section>
  );
}
