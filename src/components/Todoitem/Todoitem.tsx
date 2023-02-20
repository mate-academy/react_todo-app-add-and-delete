import React from 'react';
import classNames from 'classnames';

import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  onRemove: (todoId: number) => void,
  isBeingAdded: boolean,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onRemove,
  isBeingAdded,
}) => {
  const { title, completed, id } = todo;

  return (
    <div className={classNames('todo',
      { completed })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
        />
      </label>

      <span className="todo__title">{title}</span>

      <button
        type="button"
        className="todo__remove"
        onClick={() => onRemove(id)}
      >
        ×
      </button>

      <div className={classNames(
        'modal overlay',
        { 'is-active': isBeingAdded },
      )}
      >

        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>

  // <div className="todo">
  //   <label className="todo__status-label">
  //     <input
  //       type="checkbox"
  //       className="todo__status"
  //     />
  //   </label>

  //   <span className="todo__title">Not Completed Todo</span>
  //   <button type="button" className="todo__remove">×</button>

  //   <div className="modal overlay">
  //     <div className="modal-background has-background-white-ter" />
  //     <div className="loader" />
  //   </div>
  // </div>

  // <div className="todo">
  //   <label className="todo__status-label">
  //     <input
  //       type="checkbox"
  //       className="todo__status"
  //     />
  //   </label>

  //   {/* This form is shown instead of the title and remove button */}
  //   <form>
  //     <input
  //       type="text"
  //       className="todo__title-field"
  //       placeholder="Empty todo will be deleted"
  //       value="Todo is being edited now"
  //     />
  //   </form>

  //   <div className="modal overlay">
  //     <div className="modal-background has-background-white-ter" />
  //     <div className="loader" />
  //   </div>
  // </div>

  // <div className="todo">
  //   <label className="todo__status-label">
  //     <input type="checkbox" className="todo__status" />
  //   </label>

  //   <span className="todo__title">Todo is being saved now</span>
  //   <button type="button" className="todo__remove">×</button>

  //   {/* 'is-active' class puts this modal on top of the todo */}
  //   <div className="modal overlay is-active">
  //     <div className="modal-background has-background-white-ter" />
  //     <div className="loader" />
  //   </div>
  // </div>
  );
};
