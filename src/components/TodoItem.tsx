import React, { useContext } from 'react';
import { TodoContext } from '../context/TodoContext';
import { Todo } from '../types/Todo';

interface Props {
  todo: Todo;
}

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const {
    editingId,
    setEditingId,
    editTodoTitle,
    setEditTodoTitle,
    handleEditFormSubmission,
    handleEditingTodo,
    handleTodoToggle,
    handleDeleteTodo,
    loadingIds,
  } = useContext(TodoContext);

  const isEditing = editingId === todo.id;
  const isLoading = loadingIds.includes(todo.id);

  return (
    <div
      data-cy="Todo"
      onDoubleClick={() => {
        setEditingId(todo.id);
        setEditTodoTitle(todo.title);
      }}
      className={`todo ${todo.completed ? 'completed' : ''}`}
    >
    {/* eslint-disable-line */}  <label className="todo__status-label">
        {' '}
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onChange={() => handleTodoToggle(todo)}
          checked={todo.completed}
        />
      {/* eslint-disable-line */} </label>
      {' '}
      {isEditing ? (
        <form
          onSubmit={e => {
            e.preventDefault();
            handleEditFormSubmission(todo);
          }}
        >
          <input
            data-cy="TodoTitleField"
            type="text"
            autoFocus
            onBlur={() => handleEditFormSubmission(todo)}
            className="todo__title-field"
            onKeyUp={e => {
              if (e.key === 'Escape') {
                setEditingId(null);
                setEditTodoTitle(todo.title);
              }
            }}
            onChange={handleEditingTodo}
            value={editTodoTitle}
            placeholder="Empty todo will be deleted"
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
            onClick={() => handleDeleteTodo(todo.id)}
            data-cy="TodoDelete"
          >
            ×
          </button>
        </>
      )}
      <div
        data-cy="TodoLoader"
        className={`modal overlay ${isLoading ? 'is-active' : ''}`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
