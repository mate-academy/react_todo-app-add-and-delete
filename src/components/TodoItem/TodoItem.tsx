/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';

interface TodoItemProps {
  todo: Todo;
  handleDeleteTodo: (e: React.MouseEvent<HTMLButtonElement>) => void;
  loadingTodoId: number | null;
}

const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  handleDeleteTodo,
  loadingTodoId,
}) => {
  const { title, completed, id } = todo;

  return (
    <div
      key={todo.id}
      data-cy="Todo"
      className={`todo ${completed ? 'completed' : ''}`}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
        />
      </label>
      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={handleDeleteTodo}
        value={id}
      >
        ×
      </button>
      <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay', {
          'is-active': loadingTodoId === Number(id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

export default TodoItem;
