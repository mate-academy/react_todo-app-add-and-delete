import classNames from 'classnames';
import { Todo, TempTodo } from '../types/Todo';

type SingleTodoProps = {
  todo: Todo;
  handleRemove: (todoId: number) => void
  tempTodo: TempTodo | null;
  deletedTodoId: number | null;
};

export const SingleTodo
= ({
  todo, handleRemove, tempTodo, deletedTodoId,
}: SingleTodoProps) => (
  <div
    className={todo.completed ? 'todo completed' : 'todo'}
    data-cy="Todo"
  >
    <label className="todo__status-label">
      <input
        type="checkbox"
        className="todo__status"
        checked={todo.completed}
        data-cy="TodoStatus"
      />
    </label>
    <span className="todo__title" data-cy="TodoTitle">{todo.title}</span>
    <button
      type="button"
      data-cy="TodoDelete"
      className="todo__remove"
      onClick={() => handleRemove(todo.id)}
    >
      ×
    </button>

    <div
      data-cy="TodoLoader"
      className={classNames('modal overlay', {
        'is-active': deletedTodoId === todo.id,
      })}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>

    {tempTodo !== null
        && (
          <div data-cy="Todo" className="todo">
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
              />
            </label>

            <span data-cy="TodoTitle" className="todo__title">
              {tempTodo.title}
            </span>

            <button type="button" className="todo__remove" data-cy="TodoDelete">
              ×
            </button>

            <div
              data-cy="TodoLoader"
              className={classNames('modal overlay', {
                'is-active': tempTodo !== null,
              })}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        )}
  </div>
);
