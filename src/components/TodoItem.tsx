/* eslint-disable no-console */
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { deleteTodo, updateTodo } from '../api/todos';
import { useEffect, useRef, useState } from 'react';

type Props = {
  todo: Todo;
  allTodos: Todo[];
  setAllTodos: (arg: Todo[]) => void;
  loadingTodo: boolean;
  setErrorMessage: (arg: string) => void;
  setLoadingTodo: (arg: boolean) => void;
  loadingTodoId: number;
  setLoadingTodoId: (arg: number) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo: { title, id, completed },
  allTodos,
  setAllTodos,
  loadingTodo,
  setErrorMessage,
  setLoadingTodo,
  loadingTodoId,
  setLoadingTodoId,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    console.log('isEditing updated:', isEditing);
  }, [isEditing]);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTitle(e.target.value);
  };

  const handleSaveTitle = () => {
    if (editedTitle.trim().length === 0) {
      setErrorMessage('Title should not be empty');

      return;
    }

    updateTodo(id, { title: editedTitle })
      .then((updatedTodo: Todo) => {
        setAllTodos(allTodos.map(t => (t.id === id ? updatedTodo : t)));

        setIsEditing(false);
      })
      .catch(() => {
        setErrorMessage('Unable to update todo');
      });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedTitle(title);
  };

  const handleDeleteButton = (todoId: number) => {
    setLoadingTodo(true);
    setLoadingTodoId(todoId);

    deleteTodo(todoId)
      .then(() => {
        const filtered = allTodos.filter(todoItem => todoItem.id !== todoId);

        setAllTodos([...filtered]);
        setLoadingTodo(false);
        setLoadingTodoId(-1);
      })
      .catch(() => setErrorMessage(`Unable to delete a todo`));
  };

  const handleToggleTodo = () => {
    const updatedTodos = allTodos.map((t: Todo) =>
      t.id === id ? { ...t, completed: !t.completed } : t,
    );

    setAllTodos(updatedTodos);
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: completed,
      })}
    >
      <label className="todo__status-label" aria-label="toggle todo completion">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className={classNames('todo__status')}
          checked={completed}
          onChange={handleToggleTodo}
        />
      </label>

      {isEditing ? (
        <input
          data-cy="TodoTitleField"
          ref={inputRef}
          type="text"
          value={editedTitle}
          onChange={handleTitleChange}
          onBlur={handleSaveTitle}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              handleSaveTitle();
            }

            if (e.key === 'Escape') {
              handleCancelEdit();
            }
          }}
        />
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={handleDoubleClick}
        >
          {title}
        </span>
      )}

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => handleDeleteButton(id)}
        disabled={isEditing}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': loadingTodo && id === loadingTodoId,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
