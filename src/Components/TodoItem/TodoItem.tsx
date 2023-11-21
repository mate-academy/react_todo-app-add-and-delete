import React, { useContext, useEffect, useState } from 'react';
import cn from 'classnames';

import { Todo } from '../../types/todosTypes';
import { TodosContext, ApiErrorContext, FormFocusContext } from '../../Context';
import { deleteTodo } from '../../api/todos';
import { deleteTodoAction } from '../../Context/actions/actionCreators';

type Props = {
  todo: Todo,
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const { setIsFocused } = useContext(FormFocusContext);
  const {
    id,
    title,
    completed,
  } = todo;
  const isTodoEdited = todo.isDeleting;
  const [isDeleting, setIsDeleting] = useState(isTodoEdited || false);
  const { dispatch } = useContext(TodosContext);
  const { setApiError } = useContext(ApiErrorContext);

  useEffect(() => {
    setIsDeleting(isTodoEdited || false);
  }, [isTodoEdited, todo]);

  const handleDeleteClick = () => {
    setIsDeleting(true);
    setIsFocused(false);

    deleteTodo(id)
      .then(() => {
        const deleteAction = deleteTodoAction(id);

        dispatch(deleteAction);
      })
      .catch((error) => {
        setApiError(error);
      })
      .finally(() => {
        setIsDeleting(false);
        setIsFocused(true);
      });
  };

  return (
    <div
      className={cn('todo', {
        completed,
      })}
      data-cy="Todo"
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
        />
      </label>

      <span className="todo__title" data-cy="TodoTitle">
        {title}
      </span>

      <button
        type="button"
        className="todo__remove"
        onClick={handleDeleteClick}
        data-cy="TodoDelete"
      >
        ×
      </button>

      <div
        className={cn('modal overlay', {
          'is-active': id === 0 || isDeleting,
        })}
        data-cy="TodoLoader"
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

// {/* This is a completed todo */}
// <div className="todo completed">
//   <label className="todo__status-label">
//     <input
//       type="checkbox"
//       className="todo__status"
//       checked
//     />
//   </label>

//   <span className="todo__title">Completed Todo</span>

//   {/* Remove button appears only on hover */}
//   <button type="button" className="todo__remove">×</button>

//   {/* overlay will cover the todo while it is being updated */}
//   <div className="modal overlay">
//     <div className="modal-background has-background-white-ter" />
//     <div className="loader" />
//   </div>
// </div>

// {/* This todo is not completed */}
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

// {/* This todo is being edited */}
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
//       data-cy="TodoTitleField"
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

// {/* This todo is in loadind state */}
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
