import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import cn from 'classnames';
import { TodosContext } from '../../store/TodoProvider';
import { ActionType, Item } from '../../types/Todo';

type Props = {
  item: Item,
  isProcessed?: boolean,
  onRemove?: (id: number) => void,
};

export const TodoItem: React.FC<Props> = ({
  item,
  isProcessed = false,
  onRemove = () => {},
}) => {
  const { dispatch } = useContext(TodosContext);
  const [editing, setEditing] = useState(false);
  const fieldRef = useRef<HTMLInputElement>(null);

  const {
    id, title, completed,
  } = item;

  const toggleTodoItem = () => {
    dispatch({ type: ActionType.TOGGLE, payload: id });
  };

  const handleChangeTitle = () => {
    if (editing && fieldRef.current) {
      if (fieldRef.current.value.trim()) {
        dispatch({
          type: ActionType.UPDATE,
          payload: { ...item, title: fieldRef.current.value },
        });
      } else {
        dispatch({ type: ActionType.REMOVE, payload: id });
      }
    }

    setEditing(false);
  };

  const handleFieldKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'Escape':
        setEditing(false);
        break;
      case 'Enter':
        handleChangeTitle();
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (editing && fieldRef.current) {
      fieldRef.current.focus();
      fieldRef.current.value = title;
    }
  }, [editing, title]);

  return (
    <div className={cn('todo', { completed })} data-cy="Todo">
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={toggleTodoItem}
        />
      </label>

      {editing ? (
        <form>
          <input
            ref={fieldRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            onBlur={handleChangeTitle}
            onKeyUp={handleFieldKeyUp}
          />
        </form>
      ) : (
        <>
          <span data-cy="TodoTitle" className="todo__title">{title}</span>
          <button
            type="button"
            className="todo__remove"
            onClick={() => onRemove(id)}
            data-cy="TodoDelete"
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isProcessed,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
