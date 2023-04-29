import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  onRemove: (userId: number) => void;
  onDeleting: boolean;
  todosTransform: number[];
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onRemove,
  onDeleting,
  todosTransform,
}) => {
  return (
    <div
      className={classNames('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
        />
      </label>

      <span className="todo__title">{todo.title}</span>

      <button
        type="button"
        className="todo__remove"
        onClick={()=> {
          onRemove(todo.id);
        }}
      >
        ×
      </button>


      {onDeleting && (
        <div className={classNames(
          'modal overlay',
          {
            'is-active': todosTransform.includes(todo.id)
          },
          )}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      )}
    </div>
  );
};
