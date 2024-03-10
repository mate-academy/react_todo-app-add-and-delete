import classNames from 'classnames';
import { useContext } from 'react';
import { Todo } from '../../types/Todo';
import { deleteTodo } from '../../api/todos';
import { MyContext, MyContextData } from '../context/myContext';

interface Props {
  todo: Todo;
  loading?: boolean;
}

export const TodoItem: React.FC<Props> = ({ todo, loading }) => {
  const { handleFetchData, handleSetError } = useContext(
    MyContext,
  ) as MyContextData;

  const { id, completed, title } = todo;
  const handleClick = () => {
    if (typeof todo.id === 'number') {
      deleteTodo(id as number)
        .then(() => {
          handleFetchData();
        })
        .catch(() => {
          handleSetError('can`t remove a todo');
        });
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed,
        'temp-item-enter-done': loading,
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
      {id === 0 && (
        <div data-cy="TodoLoader" className="modal overlay is-active">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      )}
    </div>
  );
};
