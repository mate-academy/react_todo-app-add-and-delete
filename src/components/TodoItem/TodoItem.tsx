import cn from 'classnames';

import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import { Todo } from '../../types/Todo';
import { TodosContext } from '../../TodosContext';

type Props = {
  todo: Todo,
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const { id, title, completed } = todo;
  const [isHover, setIsHover] = useState(false);
  const { removeTodo, loadingMap } = useContext(TodosContext);
  const [isEditingMode, setIsEditingMode] = useState(false);

  const titleField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (titleField.current && isEditingMode) {
      titleField.current.focus();
    }
  }, [isEditingMode]);

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: todo.completed,
      })}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      onDoubleClick={() => setIsEditingMode(true)}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
        />
      </label>

      {!isEditingMode ? (
        <span data-cy="TodoTitle" className="todo__title">
          {title}
        </span>
      ) : (
        <form>
          <input
            data-cy="TodoTitleField"
            ref={titleField}
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value="Todo is being edited now"
          />
        </form>
      )}

      <button
        type="button"
        className={cn('todo__remove', {
          hidden: isHover,
        })}
        data-cy="TodoDelete"
        onClick={() => removeTodo(id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': (loadingMap as { [key: number]: boolean })[id],
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
