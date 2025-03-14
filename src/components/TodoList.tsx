/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import React from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  deleteThisTodo: (todoId: number) => void;
  isChecked: boolean;
  handleCheckedChange: (todoId: number) => void;
  isSubmitting: boolean;
  isEdited: boolean;
  selectedTodoId: number;
  setIsEdited: (isEdited: boolean) => void;
  setSelectedTodoId: (todoId: number) => void;
  handleTitleChange: (todoId: number, title: string) => void;
  submitChangedTitle: (e: React.FormEvent<HTMLFormElement>, todo: Todo) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  deleteThisTodo,
  handleCheckedChange,
  handleTitleChange,
  isEdited,
  selectedTodoId,
  setIsEdited,
  setSelectedTodoId,
  submitChangedTitle,
}: Props) => {
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>, todo: Todo) => {
    e.preventDefault();
    const newTitle = e.target.value.trim();

    handleTitleChange(todo.id, newTitle);
  };

  return (
    <div>
      {todos.map(({ id, title, completed, isSubmitting }) => (
        <div
          data-cy="Todo"
          className={classNames('todo', { completed: completed })}
          key={id}
        >
          <label htmlFor={`todo-${id}`} className="todo__status-label">
            <input
              id={`todo-${id}`}
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={completed}
              onChange={() => handleCheckedChange(id)}
            />
          </label>

          {isEdited && id === selectedTodoId ? (
            <form
              onSubmit={e =>
                submitChangedTitle(e, { id, title, completed, isSubmitting })
              }
            >
              <input
                data-cy="TodoTitleField"
                type="text"
                className="todo__title-field"
                placeholder="Empty todo will be deleted"
                defaultValue={title}
                onBlur={e =>
                  handleBlur(e, { id, title, completed, isSubmitting })
                }
                onKeyUp={e => {
                  if (e.key === 'Escape') {
                    setIsEdited(false);
                  }
                }}
                autoFocus
              />
            </form>
          ) : (
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => {
                setIsEdited(true);
                setSelectedTodoId(id);
              }}
            >
              {title}
            </span>
          )}

          {!isEdited && (
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => deleteThisTodo(id)}
              disabled={isSubmitting}
            >
              ×
            </button>
          )}

          {isSubmitting && (
            <div data-cy="TodoLoader" className="modal overlay is-active">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
