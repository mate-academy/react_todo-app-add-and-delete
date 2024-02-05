import React, { useContext } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { Loader } from './Loader';
import { TodoContext } from '../context/TodoContext';


interface Props {
  items: Todo;
}

export const TodoItem: React.FC<Props> = ({ items }) => {
  const { completed, title, id } = items;
  const { deleteTodos, setErrorMessage, setLoading } = useContext(TodoContext);

  async function handleDelete() {
    setLoading(true);

      try {
        await deleteTodos(id);
      } catch (error) {
        setErrorMessage('Unable to delete a todo');
      } finally {
        setLoading(false);
      }
  }

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className={classNames('todo__status', { completed })}
          checked={completed}
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
        onClick={handleDelete}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being updated */}
      <Loader id={id} />
    </div>

  );
};