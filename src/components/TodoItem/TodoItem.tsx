import classNames from 'classnames';
import { useContext, useState } from 'react';
import { Todo } from '../../types/Todo';
import { MyContext, MyContextData } from '../context/myContext';
import { deleteTodo } from '../../api/todos';

interface Props {
  todo: Todo | null;
}

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const { data, handleSetError, handleSetData, TodosTodelete, focusField } =
    useContext(MyContext) as MyContextData;

  const [deleting, setDeleting] = useState(false);

  if (todo === null) {
    return null;
  }

  const { id, completed, title } = todo as Todo;
  const handleClick = () => {
    setDeleting(true);
    deleteTodo(id as number)
      .then(() => {
        handleSetData(data.filter(elem => elem.id !== id));
      })
      .catch(() => {
        handleSetError('Unable to delete a todo');
      })
      .finally(() => {
        setTimeout(() => {
          focusField();
        }, 0);
        setDeleting(false);
      });
  };

  if (TodosTodelete?.find(elem => elem.id === id)) {
    handleClick();
  }

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed,
        'temp-item-enter-done': id === 0,
      })}
    >
      <label className="todo__status-label">
        <input
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
        onClick={handleClick}
      >
        ×
      </button>

      <div data-cy="TodoLoader" className="modal overlay">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
      {(id === 0 || deleting) && (
        <div data-cy="TodoLoader" className="modal overlay is-active">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      )}
    </div>
  );
};
