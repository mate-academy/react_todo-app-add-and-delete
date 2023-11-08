import React, { useContext, useState } from 'react';
import cn from 'classnames';
import { TodoType } from '../../types/TodoType';
import { deleteTodos } from '../../api/todos';
import { TodoContext } from '../../TodoContext';
import { ErrorsType } from '../../types/ErrorsType';

type Props = {
  todo: TodoType;
};

export const Todo: React.FC<Props> = ({ todo }) => {
  const {
    setErrorMessage,
    setHasDelete,
    selectedTodos,
  } = useContext(TodoContext);
  const [isDeleting, setIsDeleting] = useState(false);
  const { id, completed, title } = todo;

  const selectedAreDeleting = () => {
    return selectedTodos.some(item => item.id === id);
  };

  const handleSingleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteTodos(id);
      setHasDelete(value => !value);
    } catch {
      setIsDeleting(false);
      setErrorMessage(ErrorsType.Delete);
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    }
  };

  return (
    <div data-cy="Todo" className={cn('todo', { completed })}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          data-cy="TodoStatus"
          onChange={() => { }}
          checked={todo.completed}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">{title}</span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={handleSingleDelete}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isDeleting || selectedAreDeleting(),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
