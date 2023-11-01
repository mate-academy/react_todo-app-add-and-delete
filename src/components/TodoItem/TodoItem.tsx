/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useEffect,
  useState,
  useRef,
  useContext,
} from 'react';
import cn from 'classnames';
import { TodosContext } from '../../store/store';
import { Todo } from '../../types/Todo';
import { Dispatchers } from '../../types/enums/Dispatchers';

interface Props {
  todo: Todo;
  toggleStatus: (id: number) => void;
  isActive: boolean;
}

export const TodoItem: React.FC<Props> = ({ todo, toggleStatus, isActive }) => {
  const { dispatcher } = useContext(TodosContext);
  const [titleCurrent, setTitleCurrent] = useState('');
  const [updatedTitle, setUpdatedTitle] = useState('');
  const [isEdited, setIsEdited] = useState(false);
  const [status, setStatus] = useState(false);
  const checkbox = useRef<HTMLInputElement>(null);
  const input = useRef<HTMLInputElement>(null);

  const { title, completed, id } = todo;

  const handleDeleteTodo = (todoId: number) => {
    dispatcher({ type: Dispatchers.DeleteWithId, payload: todoId });
  };

  const handleTitleUpdate = () => {
    setIsEdited(false);

    if (!updatedTitle.trim()) {
      handleDeleteTodo(id);
    }

    dispatcher({
      type: Dispatchers.UpdateTitle,
      payload: {
        ...todo,
        title: updatedTitle,
      },
    });
  };

  const onKeysHandler = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Enter') {
      handleTitleUpdate();
    }

    if (event.key === 'Escape') {
      setIsEdited(false);
      setUpdatedTitle(titleCurrent);
    }
  };

  const onSetEdited = () => {
    setIsEdited(true);
    setTimeout(() => {
      input.current?.focus();
    }, 1);
  };

  useEffect(() => {
    setTitleCurrent(title);
    setUpdatedTitle(title);
    setStatus(completed);

    if (completed && checkbox.current) {
      checkbox.current.checked = true;
    }

    if (!completed && checkbox.current) {
      checkbox.current.checked = false;
    }
  }, [title, completed]);

  return (
    <div
      data-cy="Todo"
      className={cn(
        'todo',
        { completed: status },
      )}
    >
      <label className="todo__status-label">
        <input
          ref={checkbox}
          onClick={() => toggleStatus(id)}
          onBlur={() => setIsEdited(false)}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          id={String(id)}
        />
      </label>

      {isEdited
        ? (
          <form>
            <input
              type="text"
              value={updatedTitle}
              onChange={(event) => setUpdatedTitle(event.target.value)}
              onBlur={handleTitleUpdate}
              ref={input}
              onKeyUp={onKeysHandler}
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
            />
          </form>
        ) : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={onSetEdited}
            >
              {titleCurrent}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => handleDeleteTodo(id)}
            >
              ×
            </button>
          </>
        )}

      <div
        data-cy="TodoLoader"
        className={cn(
          'modal overlay',
          { 'is-active': isActive },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
