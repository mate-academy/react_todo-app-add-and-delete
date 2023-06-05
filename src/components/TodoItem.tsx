import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

interface TodoItemProps {
  todo: Todo,
  onDeleteTodo: (id: number) => void,
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onDeleteTodo }) => {
  const { id, completed, title } = todo;

  const handleDelete = () => {
    onDeleteTodo(id);
  };

  return (
    <div key={id} className={classNames('todo', { completed })}>
      <label className="todo__status-label">
        <input type="checkbox" className="todo__status" checked={completed} />
      </label>

      <span className="todo__title">{title}</span>

      <button type="button" className="todo__remove" onClick={handleDelete}>
        ×
      </button>

      <div className="modal overlay">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

export default TodoItem;
