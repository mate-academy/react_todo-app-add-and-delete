import '../../styles/todo.scss';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import React, { useCallback, useState } from 'react';

interface Props {
  todo: Todo;
  onUpdate: (todoToUpdate: Partial<Todo> & Pick<Todo, 'id'>) => Promise<void>;
  onDelete: (todoId: number) => Promise<void>;
}

export const TodoInfo: React.FC<Props> = ({ todo, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState<string>(todo.title);

  const handleEdit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const trimmedTitle = updatedTitle.trim();

      if (trimmedTitle === todo.title) {
        setIsEditing(false);

        return;
      }

      setIsLoading(true);

      try {
        if (!trimmedTitle) {
          await onDelete(todo.id);
        } else {
          await onUpdate({ id: todo.id, title: trimmedTitle });
        }
      } catch (error) {
        //error
      } finally {
        setIsLoading(false);
        setIsEditing(false);
      }
    },
    [onUpdate, onDelete, todo.id, updatedTitle, todo.title],
  );

  const handleCheckbox = useCallback(async () => {
    setIsLoading(true);

    try {
      await onUpdate({ id: todo.id, completed: !todo.completed });
    } catch (error) {
      //error
    } finally {
      setIsLoading(false);
    }
  }, [onUpdate, todo.id, todo.completed]);

  const handleDelete = useCallback(async () => {
    setIsLoading(true);

    try {
      await onDelete(todo.id);
    } catch (error) {
      //error
    } finally {
      setIsLoading(false);
    }
  }, [onDelete, todo.id]);

  const inputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpdatedTitle(e.target.value);
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
      key={todo.id}
    >
      {/*eslint-disable-next-line jsx-a11y/label-has-associated-control*/}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleCheckbox}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleEdit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={updatedTitle}
            onChange={inputHandler}
            autoFocus
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsEditing(true)}
          >
            {todo.title}
          </span>{' '}
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={handleDelete}
          >
            ×
          </button>
        </>
      )}

      {/* Remove button appears only on hover */}

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay', {
          'is-active': isLoading || todo.id === 0,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
