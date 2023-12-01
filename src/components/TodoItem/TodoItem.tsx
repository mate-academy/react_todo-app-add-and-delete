import React, { useContext } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { deleteTodo } from '../../api/todos';
import { TodosContext } from '../GlobalStateProvider/GlobalStateProvider';

interface Props {
  todo: Todo,
}

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const { id, title, completed } = todo;
  const {
    setTodos,
    setErrorMessage,
    closeErrorMessage,
    inputRef,
    deletionId,
    setDeletionId,
    deleteTodosIds,
  } = useContext(TodosContext);
  const handleTodoDelete = () => {
    setDeletionId(id);
    deleteTodo(id)
      .then(() => {
        setTodos(prevState => prevState.filter(t => t.id !== id));
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
        closeErrorMessage('');
      })
      .finally(() => {
        setDeletionId(null);

        if (inputRef) {
          inputRef.current?.focus();
        }
      });
  };

  return (
    <li
      data-cy="Todo"
      className={classNames('todo', {
        completed,
      })}
      key={id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked={completed}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={handleTodoDelete}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': !id || deletionId === id || deleteTodosIds.includes(id),
        })}
      >
        <div
          className="modal-background has-background-white-ter"
        />
        <div className="loader" />
      </div>
    </li>
  );
};
