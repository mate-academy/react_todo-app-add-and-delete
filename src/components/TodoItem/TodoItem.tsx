import React from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
// import { TodoContext } from '../../context/TodoContext';

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
        />
      </label>

      {/*  no span in edited todo - 3 */}
      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      {/*  no button in edited todo - 3 */}
      <button type="button" className="todo__remove" data-cy="TodoDelete">
        ×
      </button>

      {/* This form is shown instead of the title and remove button */}
      {/* <form>
        <input
          data-cy="TodoTitleField"
          type="text"
          className="todo__title-field"
          placeholder="Empty todo will be deleted"
          value="Todo is being edited now"
        />
    </form> */}

      {/* overlay will cover the todo while it is being deleted or updated */}

      {/* 'is-active' class puts in className this modal on top of the todo */}
      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': todo.id === 0,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
