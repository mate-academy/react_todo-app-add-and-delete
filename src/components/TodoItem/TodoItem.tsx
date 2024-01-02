/* eslint-disable quote-props */
import classNames from 'classnames';
import { Todo } from '../../types';
import { useTodos } from '../../context';

type Props = {
  todo: Todo,
};

export const TodoItem = ({ todo } : Props) => {
  const { completed, title, id } = todo;
  const { deleteTodoFromServer, loading } = useTodos();

  const handleDelete = (todoId:number) => () => {
    deleteTodoFromServer(todoId);
  };
  // eslint-disable-next-line spaced-comment
  //What is type of Event I need to put in carrying function?

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        'completed': completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className={classNames('todo__status', {
            'checked': completed,
          })}
          defaultChecked={completed}
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
        onClick={handleDelete(id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': loading === todo.id,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
