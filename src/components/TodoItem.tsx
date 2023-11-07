import { useState, useRef, useEffect } from 'react';
import { Todo } from '../types/Todo';
import { deleteTodo } from '../api/todos';

type Props = {
  todo: Todo;
  togleCheck: (id: number) => void;
  toDelete: (id: number) => void;
  showErrorNotification: (value: string) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  togleCheck,
  toDelete,
  showErrorNotification,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(todo.title);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const [loading, setLoading] = useState(false);
  //
  // const handleDeletedTodo = (id: number) => {
  //   deleteTodo(id);
  //   toDelete(id);
  // };
  const handleDeletedTodo = (id: number) => {
    setLoading(true);

    deleteTodo(id)
      .then(() => {
        toDelete(id);
      })
      .catch(() => {
        setLoading(false);
        showErrorNotification('Unable to delete a todo');
      });
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditValue(event.target.value);
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
      onDoubleClick={handleDoubleClick}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => togleCheck(todo.id)}
        />
      </label>

      {isEditing ? (
        <form>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            onBlur={handleBlur}
            value={editValue}
            onChange={handleInputChange}
            ref={inputRef}
          />
        </form>
      ) : (
        <>
          <span data-cy="TodoTitle" className="todo__title">
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleDeletedTodo(todo.id)}
          >
            ×
          </button>
        </>
      )}

      {/* overlay will cover the todo while it is being updated */}
      {loading && (
        <div data-cy="TodoLoader" className="modal overlay is-active">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      )}
    </div>
  );
};

//   <div className={todo.completed ? "todo completed" : ""}>
//   <div className="view">
//     <input
//       type="checkbox"
//       className="toggle"
//       id="toggle-completed"
//       checked={todo.completed}
//       onClick={() => togleCheck(todo.id)}
//     />
//     <label htmlFor="toggle-view">{todo.title}</label>
//     <button
//       type="button"
//       className="destroy"
//       aria-label="Delete todo"
//       data-cy="deleteTodo"
//       onClick={() => toDelete(todo.id)}
//     />
//   </div>
//   <input type="text" className="edit" />
// </div>;
