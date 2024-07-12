import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  list: Todo[];
  onDelete: (id: number) => void;
  idTodo: number;
};

export const ToDoList: React.FC<Props> = ({ list, onDelete, idTodo }) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {list.map(({ title, id, completed }) => (
        <div
          data-cy="Todo"
          className={`todo ${completed && 'completed'}`}
          key={id}
        >
          {/* eslint-disable jsx-a11y/label-has-associated-control  */}
          <label className="todo__status-label" htmlFor={'' + id}>
            <input
              id={'' + id}
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={completed ? true : false}
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {title}
          </span>

          {/* Remove button appears only on hover */}
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete(id)}
          >
            ×
          </button>

          {/* overlay will cover the todo while it is being deleted or updated */}
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
