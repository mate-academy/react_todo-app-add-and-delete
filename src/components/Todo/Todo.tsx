import cn from 'classnames';
import { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  deleteTodo: (arg: number) => void;
  updateTodo: (arg: number, obj: Partial<Todo>) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  deleteTodo,
  updateTodo,
}) => {
  const { id, title, completed } = todo;
  const [isUpdate, setIsUpdate] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const editHandler = (e: React.FocusEvent<HTMLInputElement, Element>) => {
    if (e.target.value.trim()) {
      updateTodo(id, { title: e.target.value.trim() });
      setIsUpdate(false);
    } else {
      deleteTodo(id);
    }
  };

  useEffect(() => {
    if (isUpdate && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isUpdate]);

  return (
    <div className={cn('todo', { completed })}>
      <label
        className={cn('todo__status-label', { outline: !completed })}
      >
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => updateTodo(id, { completed: !completed })}
        />
      </label>
      {!isUpdate
        ? (
          <>
            <span
              className="todo__title"
              onDoubleClick={() => setIsUpdate(true)}
            >
              {title}
            </span>
            <button
              type="button"
              className="todo__remove"
              onClick={() => deleteTodo(id)}
            >
              ×
            </button>
          </>
        ) : (
          <>
            <form>
              <input
                type="text"
                className="todo__title-field"
                style={{ outline: 'none' }}
                placeholder="Empty todo will be deleted"
                defaultValue={title}
                onBlur={editHandler}
                ref={inputRef}
              />
            </form>

            <div className="modal overlay">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </>
        ) }
    </div>
  );
};
