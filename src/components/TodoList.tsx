import cn from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  list: Todo[];
  onDelete: (id: number) => void;
  idTodo: number;
};

export const TodoList: React.FC<Props> = ({ list, onDelete, idTodo }) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {list.map(({ title, id, completed }) => (
        <div
          data-cy="Todo"
          className={cn('todo', { completed: completed })}
          key={id}
        >
          {/* eslint-disable jsx-a11y/label-has-associated-control  */}
          <label className="todo__status-label" htmlFor={String(id)}>
            <input
              id={'' + id}
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={completed}
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete(id)}
          >
            ×
          </button>

          <div
            data-cy="TodoLoader"
            className={cn('modal overlay', {
              'is-active': id === idTodo,
            })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}
    </section>
  );
};
