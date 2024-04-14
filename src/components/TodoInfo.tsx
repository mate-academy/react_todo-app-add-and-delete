/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useContext } from 'react';
import { Todo } from '../types/Todo';
import cn from 'classnames';
import { DispatchContext, StateContext } from '../context/ContextReducer';

interface Props {
  todo: Todo;
}

export const TodoInfo: React.FC<Props> = ({ todo }) => {
  const {fetch } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
      <label className="todo__status-label">
        <input data-cy="TodoStatus" type="checkbox" className="todo__status" />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      <button
        onClick={() => dispatch({type: 'deleteTodo', currentId: todo.id})}
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
      >
        ×
      </button>

      <div data-cy="TodoLoader" className={cn("modal overlay", {"is-active": fetch })}>
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>

      {/* <div data-cy="Todo" className="todo">
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
          />
        </label>

        <form>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value="Todo is being edited now"
          />
        </form>


      </div> */}
          {/* <div data-cy="TodoLoader" className="modal overlay">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div> */}
    </div>
  );
};
