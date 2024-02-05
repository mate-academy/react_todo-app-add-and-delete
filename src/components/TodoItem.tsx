import {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

import { TodoContext } from './TodosContext';

interface Props {
  todo: Todo;
}

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const { toggleCompleted, deleteTodo, deleteTodoId } = useContext(TodoContext);
  const [isEditing, setEditing] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleToggleTodo = () => {
    toggleCompleted(todo.id);
  };

  const handleDeleteTodo = () => {
    deleteTodo(todo.id);
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  return (
    <div
      data-cy="Todo"
      className={todo.completed ? 'todo completed' : 'todo'}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleToggleTodo}
        />
      </label>

      {isEditing ? (
        <form>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            ref={inputRef}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setEditing(true)}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={handleDeleteTodo}
          >
            ×
          </button>

          <div
            data-cy="TodoLoader"
            className={classNames('modal overlay', {
              'is-active': deleteTodoId.includes(todo.id),
            })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </>
      )}
    </div>
  );
};
