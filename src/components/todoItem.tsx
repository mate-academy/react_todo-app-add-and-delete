/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import { Todo } from '../types/Todo';
import cn from 'classnames';

interface Props {
  todo: Todo;
  onDeleteTodo: (id: number) => void;
  isLoading?: boolean;
}

const TodoItem: React.FC<Props> = ({ todo, onDeleteTodo, isLoading }) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const [isDelete, setIsdelete] = useState<boolean>(false);

  // console.log(isLoading);

  const handleEditToggle = () => {
    setIsEditing(prevState => !prevState);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTitle(e.target.value);
  };

  const handleSaveEdit = () => {
    setIsEditing(false);
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
          // onChange={handleStatusChange} .
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
        className={cn('modal', 'overlay', {
          'is-active': !todo.id || isLoading || isDelete,
        })}
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
          setIsdelete(true);
        }}
      >
        ×
      </button>
    </div>
  );
};

export default TodoItem;
