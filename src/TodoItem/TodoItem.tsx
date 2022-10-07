import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todoItem: Todo;
  handleDelete: (id: number)=> void;
  selectedTodo: number[];
};

export const TodoItem: React.FC<Props> = ({
  todoItem,
  handleDelete,
  selectedTodo,
}) => {
  const isActive = selectedTodo.includes(todoItem.id)
   || todoItem.id === 0;

  return (
    <div
      data-cy="Todo"
      className={classNames(
        'todo', {
          'todo completed': todoItem.completed,
        },
      )}

    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">{todoItem.title}</span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={() => handleDelete(todoItem.id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal',
          'overlay',
          {
            'is-active': isActive,
          },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>

    </div>
  );
};
