import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo,
  isProcessing?: boolean,
  onDelete: (todoId: number) => void,
  onRename: (todoId: number, title: string) => void,
  onComplete: (todo: Todo) => void,
};

export const TodoItem: React.FC<Props> = React.memo(
  ({
    todo,
    isProcessing,
    onDelete,
    onRename,
    onComplete,
  }) => {
    const [isRenaming, setIsRenaming] = useState(false);
    const [title, setTitle] = useState(todo.title);
    const [newTitle, setNewTitle] = useState(todo.title);
    const renameInput = useRef<HTMLInputElement>(null);

    const onRenameHander = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!newTitle) {
        onDelete(todo.id);

        return;
      }

      if (title === newTitle) {
        setIsRenaming(false);

        return;
      }

      setIsRenaming(false);
      setTitle(newTitle);
      onRename(todo.id, newTitle);
    };

    useEffect(() => {
      renameInput.current?.focus();

      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
          setIsRenaming(false);
        }
      });
    }, [isRenaming]);

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
            defaultChecked={todo.completed}
            onClick={() => onComplete(todo)}
          />
        </label>

        {!isRenaming
          ? (
            <>
              <span
                data-cy="TodoTitle"
                className="todo__title"
                onDoubleClick={() => setIsRenaming(true)}
              >
                {title}
              </span>

              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDeleteButton"
                onClick={() => onDelete(todo.id)}
              >
                ×
              </button>
            </>
          ) : (
            <form
              onSubmit={onRenameHander}
              onBlur={onRenameHander}
            >
              <input
                data-cy="TodoTitleField"
                ref={renameInput}
                type="text"
                className="todo__title-field"
                placeholder="Empty todo will be deleted"
                value={newTitle}
                onChange={(event) => setNewTitle(event.target.value)}
              />
            </form>
          )}

        <div
          data-cy="TodoLoader"
          className={classNames('modal overlay', {
            'is-active': isProcessing,
          })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    );
  },
);
