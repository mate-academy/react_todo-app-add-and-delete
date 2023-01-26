import React, { useContext, useState } from 'react';
import cn from 'classnames';
import { TempTodo, Todo } from '../../types/Todo';
import { deleteTodo } from '../../api/todos';
import { AppContext } from '../../AppContext';
import { ErrorType } from '../../types/ErrorType';

type Props = {
  todo: Todo | TempTodo;
};
export const TodoInfo:React.FC<Props> = ({ todo }) => {
  const [isEditing] = useState(false);
  const [isDeleting, setDeleting] = useState(false);

  const {
    setError,
    todos,
    setTodos,
    isLoading,
  } = useContext(AppContext);

  const isLoaderActive = isDeleting
    || todo.id === 0
    || (todo.completed && isLoading);

  const handleDelete = async () => {
    const updatedTodos = todos.filter(item => item.id !== todo.id);

    try {
      setDeleting(true);
      await deleteTodo(todo.id);
      setTodos(updatedTodos);
      setDeleting(false);
    } catch {
      setError(ErrorType.RemovalError);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo',
        { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          readOnly
        />
      </label>

      {isEditing ? (
        <form>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            defaultValue={todo.title}
          />
        </form>
      ) : (
        <>
          <span data-cy="TodoTitle" className="todo__title">{todo.title}</span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDeleteButton"
            onClick={handleDelete}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isLoaderActive,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
