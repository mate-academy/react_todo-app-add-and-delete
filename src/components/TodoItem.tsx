import React,
{
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';
import { TodosContext } from '../TodoContext/TodoContext';
import { Todo } from '../types/Todo';

interface TodoItems {
  todo: Todo;
}

export const TodoItem: React.FC<TodoItems> = ({ todo }) => {
  const {
    title,
    completed,
    id,
  } = todo;

  const {
    setCompleted,
    deleteTodo,
    saveEditingTitle,
    deleteTodosId,
  } = useContext(TodosContext);

  const [isEdeting, setIsEditing] = useState(false);
  const [editingTitle, setEditingTitle] = useState(todo.title);

  const titleFocus = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (titleFocus.current) {
      titleFocus.current.focus();
    }
  }, [isEdeting]);

  const handleOnKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      if (editingTitle.trim()) {
        saveEditingTitle(todo.id, editingTitle.trim());
        setEditingTitle(editingTitle.trim());
        setIsEditing(false);
      } else {
        deleteTodo(todo.id);
      }
    }

    if (event.key === 'Escape') {
      if (!editingTitle.trim()) {
        setIsEditing(false);
        setEditingTitle(todo.title);
      } else {
        setIsEditing(false);
        setEditingTitle(todo.title);
      }
    }
  };

  const handleOnBlur = () => {
    setIsEditing(false);
    saveEditingTitle(todo.id, editingTitle.trim());
  };

  return (
    <div
      key={todo.id}
      data-cy="Todo"
      className={classNames('todo', { completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => setCompleted(id)}
        />
      </label>

      {isEdeting ? (
        <form>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editingTitle.trim()}
            onChange={(event) => setEditingTitle(event.currentTarget.value)}
            onBlur={handleOnBlur}
            ref={titleFocus}
            onKeyUp={(event) => handleOnKeyUp(event)}
          />
        </form>
      ) : (
        <>
          <span
            onDoubleClick={() => {
              setIsEditing(true);
            }}
            data-cy="TodoTitle"
            className="todo__title"
          >
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => deleteTodo(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': deleteTodosId.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
