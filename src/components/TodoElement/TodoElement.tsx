import React, { useState } from 'react';
import { Todo } from '../../types/Todo';
import { TodoStatus } from '../TodoStatus';
import { TodoLoader } from '../TodoLoader';
import { TodoEdit } from '../TodoEdit';

interface TodoElementProps {
  todo: Todo;
  handleTodoDelete: (keyTodo: number) => void;
  handleToggleStatus: (idTodo: number) => void;
  handleUpdateTodo: (updateTodo: Todo) => void;
}

export const TodoElement: React.FC<TodoElementProps> = ({
  todo,
  handleTodoDelete,
  handleToggleStatus,
  handleUpdateTodo,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleEditedTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const trimmedTitle = e.target.value.trim();

    setEditedTitle(trimmedTitle);
  };

  const finishEditedTitle = () => {
    const trimEditedTitle = editedTitle.trim();

    if (trimEditedTitle === todo.title) {
      setIsEditing(false);
    } else if (!trimEditedTitle) {
      handleTodoDelete(todo.id);
    } else {
      const updateTodos = { ...todo, title: editedTitle };

      setEditedTitle(editedTitle);
      setIsEditing(false);

      handleUpdateTodo(updateTodos);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      finishEditedTitle();
    }
  };

  const handleInputBlur = () => finishEditedTitle();

  const loading = !todo.isLoaded;

  return (
    <div data-cy="Todo" className={`todo ${todo.completed ? 'completed' : ''}`}>
      <TodoStatus
        isCompletedTodo={todo.completed}
        todoStatus={() => handleToggleStatus(todo.id)}
      />

      {isEditing ? (
        <TodoEdit
          handleEditedTitle={handleEditedTitle}
          handleKeyDown={handleKeyDown}
          handleInputBlur={handleInputBlur}
          editedTitle={editedTitle}
        />
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={handleDoubleClick}
        >
          {editedTitle}
        </span>
      )}

      {!isEditing && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => handleTodoDelete(todo.id)}
        >
          ×
        </button>
      )}

      <TodoLoader loading={loading} />
    </div>
  );
};
