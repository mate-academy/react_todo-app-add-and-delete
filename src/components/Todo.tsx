import { useState } from 'react';
import { TodoType } from '../types/TodoType';
import { updateTodoTitle } from '../api/todos';

interface TodoProps {
  todo: TodoType;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  handleNewTitle: (id: number, newTitle?: string) => void;
  loading: boolean
  setTodoLoading: (id:number, boolean: boolean) => void
}

const Todo = (
  {
    todo, onToggle, onDelete, handleNewTitle, loading, setTodoLoading,
  }: TodoProps,
) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    setTodoLoading(todo.id, true);
    updateTodoTitle(todo.id, editedTitle)
      .then(updatedTodo => {
        handleNewTitle(todo.id, updatedTodo.title.trim());
        setIsEditing(false);
        setTodoLoading(todo.id, false);
      });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTitle(e.target.value);
  };

  return (
    <div key={todo.id} data-cy="Todo" className={`todo ${todo.completed ? 'completed' : ''}`}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleSaveClick}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            value={editedTitle}
            onChange={handleInputChange}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleEditClick}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <div data-cy="TodoLoader" className={`modal overlay ${loading ? 'is-active' : ''}`}>
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

export default Todo;
