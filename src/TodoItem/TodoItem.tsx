import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todoItem: Todo;
  handleClickDelete: (id: number)=> void
};

export const TodoItem: React.FC<Props> = ({ todoItem, handleClickDelete }) => {
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
        onClick={()=>handleClickDelete(todoItem.id)}
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
