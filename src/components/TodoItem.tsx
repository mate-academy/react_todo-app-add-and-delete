import React from 'react';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo;
  editingTodoId: number | null;
  setEditingTodoId: (id: number | null) => void;
  editingTitle: string;
  setEditingTitle: (title: string) => void;
  saveTodo: (id: number, title: string) => void;
  deleteTodo: (id: number) => void;
  loadingTodoIds: number[];
}

export const TodoItem: React.FC<Props> = ({
  todo,
  editingTodoId,
  setEditingTodoId,
  editingTitle,
  setEditingTitle,
  saveTodo,
  deleteTodo,
  loadingTodoIds,
}) => (
  <div
    key={todo.id}
    data-cy="Todo"
    className={`todo ${todo.completed ? 'completed' : ''}`}
  >
    <label className="todo__status-label">
      <input
        aria-label="Toggle todo status"
        data-cy="TodoStatus"
        type="checkbox"
        className="todo__status"
        checked={todo.completed}
        onChange={() => saveTodo(todo.id, todo.title)}
      />
    </label>

    {editingTodoId === todo.id ? (
      <form>
        <input
          data-cy="TodoTitleField"
          type="text"
          className="todo__title-field"
          placeholder="Empty todo will be deleted"
          value={editingTitle}
          onChange={e => setEditingTitle(e.target.value)}
          onBlur={() => {
            if (editingTitle.trim()) {
              saveTodo(todo.id, editingTitle.trim());
            } else {
              deleteTodo(todo.id);
            }

            setEditingTodoId(null);
          }}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.currentTarget.blur();
            }

            if (e.key === 'Escape') {
              setEditingTodoId(null);
              setEditingTitle(todo.title);
            }
          }}
        />
      </form>
    ) : (
      <span
        data-cy="TodoTitle"
        className="todo__title"
        onDoubleClick={() => {
          setEditingTodoId(todo.id);
          setEditingTitle(todo.title);
        }}
      >
        {todo.title}
      </span>
    )}

    <button
      type="button"
      className="todo__remove"
      data-cy="TodoDelete"
      onClick={() => deleteTodo(todo.id)}
    >
      ×
    </button>

    <div
      data-cy="TodoLoader"
      className={`modal overlay ${loadingTodoIds.includes(todo.id) ? 'is-active' : ''}`}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  </div>
);
