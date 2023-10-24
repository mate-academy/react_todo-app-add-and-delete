import React, {
  useEffect,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';
import { ToDo } from '../../types/ToDo';

type Props = {
  todo: ToDo;
  updateTodo: (id: number, title: string) => void;
  removeTodo: (id: number) => void;
  markAsComplete: (id: number) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  updateTodo,
  removeTodo,
  markAsComplete,
}) => {
  const { id, title, completed } = todo;
  const elemtnId = `toggle-${id}`;

  const [editMode, setEditMode] = useState(false);
  const [changedTitle, setChangedTitle] = useState(title);

  const handleEditMode = () => {
    setEditMode(true);
  };

  const handlkeMarkOneComplete = () => {
    markAsComplete(id);
  };

  const handleChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChangedTitle(event.target.value);
  };

  const handleApplyChanges = () => {
    const newTitile = changedTitle.trim();

    if (newTitile.length === 0) {
      removeTodo(id);
    } else {
      setChangedTitle(newTitile);
      setEditMode(false);
      updateTodo(id, newTitile);
    }
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setChangedTitle(title);
  };

  const handleKeyUp = (event: React.KeyboardEvent) => {
    switch (event.key.toLowerCase()) {
      case 'enter':
        handleApplyChanges();
        break;
      case 'escape':
        handleCancelEdit();
        break;
      default:
        break;
    }
  };

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [editMode]);

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed,
        editing: editMode,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          id={elemtnId}
          onChange={handlkeMarkOneComplete}
        />
      </label>
      {editMode ? (
        <form>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={changedTitle}
            onChange={handleChangeTitle}
            onBlur={handleApplyChanges}
            onKeyUp={handleKeyUp}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleEditMode}
          >
            {title}
          </span>
          {/* Remove button appears only on hover */}
          <button type="button" className="todo__remove" data-cy="TodoDelete">
            ×
          </button>
        </>
      )}

      {/* overlay will cover the todo while it is being updated */}
      {/* 'is-active' class puts this modal on top of the todo */}
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': todo.id === 0,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
