import { Todo } from '../../types/Todo';
import cn from 'classnames';

type Props = {
  toDo: Todo;
  isLoading: boolean;
  handlerDeleteTodo: (id: number) => void;
  deleting: boolean;
};

export const TodoItem: React.FC<Props> = ({
  toDo,
  isLoading,
  handlerDeleteTodo,
  deleting,
}) => {
  return (
    <div data-cy="Todo" className={cn('todo', { completed: toDo.completed })}>
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label ">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={toDo.completed}
          readOnly
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {toDo.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => {
          handlerDeleteTodo(toDo.id);
        }}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', { 'is-active': isLoading || deleting })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
