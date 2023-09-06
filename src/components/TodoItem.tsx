import React, { useContext, useEffect, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';
// eslint-disable-next-line import/no-cycle
import { TodosContext } from './TodosContext';

export type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const { toggleCompleted, deleteTodo, editTodo } = useContext(TodosContext);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);

  useEffect(() => {
    setEditedTitle(todo.title);
  }, [todo.title]);

  // includes functionality to enable editing mode
  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  // Pressing the key to save/cancel editing
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      if (editedTitle.trim() !== '') {
        editTodo(todo.id, editedTitle);
        setIsEditing(false);
      } else {
        deleteTodo(todo.id);
      }
    } else if (event.key === 'Escape') {
      setIsEditing(false);
      setEditedTitle(todo.title);
    }
  };

  return (
    <div className={cn('todo', { completed: todo.completed })}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          id={`toggle-completed-${todo.id}`}
          onChange={() => toggleCompleted(todo.id)}
          onKeyDown={handleKeyDown}
        />
      </label>

      {isEditing ? (
        <input
          type="text"
          className="todo__title"
          value={editedTitle}
          onChange={e => setEditedTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => setIsEditing(false)}
        />
      ) : (
        <span
          className="todo__title"
          onDoubleClick={handleDoubleClick}
        >
          {todo.title}
        </span>
      )}

      <button
        type="button"
        className="todo__remove"
        onClick={() => deleteTodo(todo.id)}
      >
        ×
      </button>

      <div className="modal overlay">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
