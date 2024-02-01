import React, { useState } from 'react';
import cn from 'classnames';

import { Todo } from '../../types/Todo';
import { deleteTodo } from '../../api/todos';

interface Props {
  todo: Todo;
  onDelete: (id: number) => void;
  onError: (err: string) => void;
}

export const TodoComponent: React.FC<Props> = (props) => {
  const { todo, onDelete, onError } = props;
  const [deleting, setDeleting] = useState(false);
  const loading = todo.id === 0;

  function removeTodo(): void {
    setDeleting(true);

    deleteTodo(todo.id)
      .then(() => onDelete(todo.id))
      .catch(() => {
        onError('Unable to delete a todo');
        setDeleting(false);
      });
  }

  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => removeTodo()}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being updated */}

      <div
        data-cy="TodoLoader"
        className={cn('modal', 'overlay', {
          'is-active': loading || deleting,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>

    </div>
  );
};

/* {/* This todo is being edited
<div data-cy="Todo" className="todo">
  <label className="todo__status-label">
    <input
      data-cy="TodoStatus"
      type="checkbox"
      className="todo__status"
    />
  </label>

   This form is shown instead of the title and remove button
  <form>
    <input
      data-cy="TodoTitleField"
      type="text"
      className="todo__title-field"
      placeholder="Empty todo will be deleted"
      value="Todo is being edited now"
    />
  </form>

  <div data-cy="TodoLoader" className="modal overlay">
    <div className="modal-background has-background-white-ter" />
    <div className="loader" />
  </div>
</div>
 This todo is in loadind state
<div data-cy="Todo" className="todo">
  <label className="todo__status-label">
    <input
      data-cy="TodoStatus"
      type="checkbox"
      className="todo__status"
    />
  </label>

  <span data-cy="TodoTitle" className="todo__title">
    Todo is being saved now
  </span>

  <button type="button" className="todo__remove" data-cy="TodoDelete">
    ×
  </button>

  {/* 'is-active' class puts this modal on top of the todo
  <div data-cy="TodoLoader" className="modal overlay is-active">
    <div className="modal-background has-background-white-ter" />
    <div className="loader" />
  </div>
</div> */
