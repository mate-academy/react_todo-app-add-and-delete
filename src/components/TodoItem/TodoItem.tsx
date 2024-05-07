import cn from 'classnames';
import { Todo } from '../../types/Todo';

interface Props {
  tempTodo: Todo | null;
  loader: boolean;
}

export const TodoItem = ({ tempTodo, loader }: Props) =>
  tempTodo && (
    <div data-cy="Todo" className="todo" key={tempTodo.id}>
      <label
        className="todo__status-label"
        aria-labelledby={`todo_${tempTodo.id}`}
      >
        <input
          id={`todo_${tempTodo.id}`}
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
        className={cn('modal overlay', {
          'is-active': loader,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
