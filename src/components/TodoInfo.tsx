/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  completeTodo: (todoId: number) => void;
  deleteTodo: (todoId: number) => void;
  loadingTodos: Todo[] | null;
};

export const TodoInfo: React.FC<Props> = ({
  todo: { title, completed, id },
  completeTodo,
  deleteTodo,
  loadingTodos,
}) => (
  <>
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: completed,
      })}
      key={id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => completeTodo(id)}
        />
      </label>

      <>
        <span data-cy="TodoTitle" className="todo__title">
          {title}
        </span>

        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => deleteTodo(id)}
        >
          ×
        </button>
      </>

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': loadingTodos?.find(loadingTodo => loadingTodo.id === id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  </>
);
