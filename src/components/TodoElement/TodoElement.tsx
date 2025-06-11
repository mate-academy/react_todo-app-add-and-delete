import { TodoStatus } from '../TodoStatus';
import { TodoTitle } from '../TodoTitle/TodoTitle';
import { Todo } from '../../types/Todo';
import { TodoLoader } from '../TodoLoader';
import { TodoDelete } from '../TodoDelete';
import { useState } from 'react';
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
    /* This is a completed todo Remove button appears only on hover overlay will cover the todo while it is being deleted or updated */
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
        <TodoTitle title={editedTitle} onDoubleClick={handleDoubleClick} />
      )}

      {!isEditing && <TodoDelete onDelete={() => handleTodoDelete(todo.id)} />}

      <TodoLoader loading={loading} />
    </div>
  );
};
