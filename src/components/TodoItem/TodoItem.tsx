/* eslint-disable @typescript-eslint/indent */
/* eslint-disable jsx-a11y/label-has-associated-control */
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import React, { KeyboardEvent, useEffect, useRef, useState } from 'react';
import { deleteTodo, updateTodo } from '../../utils/helpers';
import { errorMessages } from '../../utils/const';
import { EditnigProperty } from '../../types/EditingProperty';

type Props = {
  todo: Todo;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setError: React.Dispatch<
    React.SetStateAction<{ hasError: boolean; message: string }>
  >;
  isLoading?: boolean;
  setIsLoading: (value: boolean) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  setTodos,
  setError,
  isLoading,
  setIsLoading,
}) => {
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [title, setTitle] = useState<string>(todo.title);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const titleFocus = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && titleFocus.current) {
      titleFocus.current.focus();
    }
  }, [isEditing]);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteTodo(todo.id);
      setTodos(currentTodos => currentTodos.filter(t => t.id !== todo.id));
    } catch (error) {
      setError({ hasError: true, message: errorMessages.deleteError });
    } finally {
      setIsDeleting(false);
    }
  };

  async function updater(param: EditnigProperty) {
    setIsUpdating(true);
    setIsLoading(true);
    try {
      const updatedTodo = await updateTodo(todo.id, param);

      setTodos(currentTodos =>
        currentTodos.map(t => (t.id === todo.id ? updatedTodo : t)),
      );
    } catch (error) {
      setError({ hasError: true, message: errorMessages.updateError });
      throw new Error();
    } finally {
      setIsUpdating(false);
      setIsLoading(false);
    }
  }

  const handleStatusChange = () => {
    updater({ completed: !todo.completed });
  };

  const onChangeHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedTitle = title.trim();

    setIsLoading(true);
    setIsUpdating(true);

    if (!trimmedTitle) {
      try {
        await deleteTodo(todo.id);
        setTodos(currentTodos => currentTodos.filter(t => t.id !== todo.id));
      } catch (error) {
        setError({ hasError: true, message: errorMessages.deleteError });
      } finally {
        setIsLoading(false);
        setIsUpdating(false);
      }

      return;
    }

    if (trimmedTitle === todo.title) {
      setIsEditing(false);
      setIsLoading(false);
      setIsUpdating(false);

      return;
    }

    try {
      await updater({ title: trimmedTitle });
      setIsEditing(false);
    } catch {
      titleFocus.current?.focus();
    } finally {
      setIsLoading(false);
      setIsUpdating(false);
    }
  };

  const onBlur = async () => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      try {
        await deleteTodo(todo.id);
        setTodos(currentTodos => currentTodos.filter(t => t.id !== todo.id));
      } catch (error) {
        setError({ hasError: true, message: errorMessages.deleteError });
      } finally {
        setIsLoading(false);
        setIsUpdating(false);
      }
    } else if (trimmedTitle !== todo.title) {
      await updater({ title: trimmedTitle });
    }

    setIsEditing(false);
  };

  const handleKeyUp = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setTitle(todo.title);
      setIsEditing(false);
    }
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onClick={handleStatusChange}
          checked={todo.completed}
        />
      </label>
      {isEditing ? (
        <form onSubmit={onChangeHandler}>
          <input
            data-cy="TodoTitleField"
            type="text"
            onBlur={onBlur}
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={title}
            ref={titleFocus}
            onKeyUp={handleKeyUp}
            onChange={e => setTitle(e.target.value)}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleDoubleClick}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isLoading || isDeleting || isUpdating,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
