// import { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  onDelete: (id: number) => void;
  isModalVisible: boolean;
  loadingId: number[],
  isLoaderActive: boolean,
};

export const TodoApp: React.FC<Props> = ({
  todo,
  onDelete = () => { },
  loadingId,
  isLoaderActive,
}) => {
  const { id, completed, title } = todo;
  // const [isEditing, setIsEditing] = useState(false);
  // const [todoTitle, setTodoTitle] = useState(todo.title);

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed })}
    >
      <label
        className="todo__status-label"
      >
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          // onClick={handleToggleCompleted}
        />
      </label>

      <span
        data-cy="TodoTitle"
        className="todo__title"
      >
        {title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => onDelete(todo.id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': loadingId.includes(id) && isLoaderActive,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>

      {false && (
        <form>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value="Todo is being edited now."
          />
        </form>
      )}
    </div>
  );
};
