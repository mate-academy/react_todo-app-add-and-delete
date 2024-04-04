/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import { Todo } from '../types/Todo';
import cn from 'classnames';
import { Status } from '../types/Status';

interface Props {
  todo: Todo;
  onDeleteTodo: (id: number) => void;
  onUpdateTodo: (updatedTodo: Todo) => void;
  loading: boolean;
}

const TodoItem: React.FC<Props> = ({
  todo,
  onDeleteTodo,
  onUpdateTodo,
  loading,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);

  const handleEditToggle = () => {
    setIsEditing(prevState => !prevState);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTitle(e.target.value);
  };

  const handleSaveEdit = () => {
    setIsEditing(false);
    const updatedTodo: Todo = {
      ...todo,
      title: editedTitle,
    };

    onUpdateTodo(updatedTodo);
  };

  const handleCheckboxChange = () => {
    const updatedTodo: Todo = {
      ...todo,
      completed: !todo.completed,
    };

    if (todo.status === Status.Active) {
      updatedTodo.status = Status.Completed;
    } else if (todo.status === Status.Completed) {
      updatedTodo.status = Status.Active;
    }

    onUpdateTodo(updatedTodo);
  };

  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
      <label className="todo__status-label" htmlFor={`TodoStatus-${todo.id}`}>
        <input
          id={`TodoStatus-${todo.id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleCheckboxChange}
        />
      </label>
      {isEditing ? (
        <form onSubmit={handleSaveEdit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editedTitle}
            onChange={handleTitleChange}
            onBlur={handleSaveEdit}
          />
        </form>
      ) : (
        <span
          data-cy="TodoTitle"
          className={cn('todo__title', { hidden: isEditing })}
          onClick={handleEditToggle}
        >
          {todo.title}
        </span>
      )}

      <div
        data-cy="TodoLoader"
        className={`modal overlay ${!todo.id || (loading && todo.id === selectedTodo?.id) ? 'is-active' : ''}`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => {
          onDeleteTodo(todo.id);
          setSelectedTodo(todo);
        }}
      >
        ×
      </button>
    </div>
  );
};

export default TodoItem;
