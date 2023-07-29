import React, { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { deleteTodoFromServer } from '../api/todos';
import { TodoError } from '../types/TodoError';

type Props = {
  todo: Todo,
  deleteTodo: (todoId: number) => void,
  setErrorMessage: (newError: TodoError) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  deleteTodo,
  setErrorMessage,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteClick = () => {
    setIsLoading(true);

    deleteTodoFromServer(todo.id)
      .then(() => deleteTodo(todo.id))
      .catch(() => setErrorMessage(TodoError.Delete))
      .finally(() => setIsLoading(false));
  };

  return (
    <li
      className={classNames('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
        />
      </label>

      <span className="todo__title">
        {todo.title}
      </span>
      <button
        type="button"
        className="todo__remove"
        onClick={handleDeleteClick}
      >
        ×
      </button>

      <div
        className={classNames('modal overlay', {
          'is-active': isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </li>
  );
};

// const unusedMarkup = (
//   <>
//     {/* This is a completed todo */}
//     <div className="todo completed">
//       <label className="todo__status-label">
//         <input
//           type="checkbox"
//           className="todo__status"
//           checked
//         />
//       </label>

//       <span className="todo__title">Completed Todo</span>

//       {/* Remove button appears only on hover */}
//       <button type="button" className="todo__remove">×</button>

//       {/* overlay will cover the todo while it is being updated */}
//       <div className="modal overlay">
//         <div className="modal-background has-background-white-ter" />
//         <div className="loader" />
//       </div>
//     </div>

//     {/* This todo is not completed */}
//     <div className="todo">
//       <label className="todo__status-label">
//         <input
//           type="checkbox"
//           className="todo__status"
//         />
//       </label>

//       <span className="todo__title">Not Completed Todo</span>
//       <button type="button" className="todo__remove">×</button>

//       <div className="modal overlay">
//         <div className="modal-background has-background-white-ter" />
//         <div className="loader" />
//       </div>
//     </div>

//     {/* This todo is being edited */}
//     <div className="todo">
//       <label className="todo__status-label">
//         <input
//           type="checkbox"
//           className="todo__status"
//         />
//       </label>

//       {/* This form is shown instead of the title and remove button */}
//       <form>
//         <input
//           type="text"
//           className="todo__title-field"
//           placeholder="Empty todo will be deleted"
//           value="Todo is being edited now"
//         />
//       </form>

//       <div className="modal overlay">
//         <div className="modal-background has-background-white-ter" />
//         <div className="loader" />
//       </div>
//     </div>
//   </>
// );
