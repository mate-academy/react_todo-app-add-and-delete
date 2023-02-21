import React from 'react';
import { deleteTodo } from '../../api/todos';
import { ErrorType } from '../../types/ErrorType';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  userId: number,
  fetchTodos: (userId: number) => void,
  changeHasError: (typeError: ErrorType) => void,
  changeIsError: () => void,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  userId,
  fetchTodos,
  changeHasError,
  changeIsError,
}) => {
  const fetchDeleteTodo = async (todoId: number) => {
    try {
      await deleteTodo(todoId);
      await fetchTodos(userId);
    } catch {
      changeIsError();
      changeHasError(ErrorType.DELETE_ERROR);
    }
  };

  return (
    <>
      {/* This is a completed todo */}
      {todo.completed ? (
        <div className="todo completed">
          <label className="todo__status-label">
            <input
              type="checkbox"
              className="todo__status"
              checked
            />
          </label>

          <span className="todo__title">{todo.title}</span>

          {/* Remove button appears only on hover */}
          <button
            type="button"
            className="todo__remove"
            onClick={() => fetchDeleteTodo(todo.id)}
          >
            ×
          </button>

          {/* overlay will cover the todo while it is being updated */}
          <div className="modal overlay">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ) : (
        /* This todo is not completed */
        <div className="todo">
          <label className="todo__status-label">
            <input
              type="checkbox"
              className="todo__status"
            />
          </label>

          <span className="todo__title">{todo.title}</span>
          <button
            type="button"
            className="todo__remove"
            onClick={() => fetchDeleteTodo(todo.id)}
          >
            ×
          </button>

          <div className="modal overlay">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}

      {/* This todo is being edited */}
      <div className="todo">
        {/* <label className="todo__status-label">
          <input
            type="checkbox"
            className="todo__status"
          />
        </label> */}

        {/* This form is shown instead of the title and remove button */}
        {/* <form>
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value="Todo is being edited now"
          />
        </form> */}

        {/* <div className="modal overlay">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div> */}
      </div>

      {/* This todo is in loadind state */}
      <div className="todo">
        {/* <label className="todo__status-label">
          <input type="checkbox" className="todo__status" />
        </label> */}

        {/* <span className="todo__title">Todo is being saved now</span>
        <button type="button" className="todo__remove">×</button> */}

        {/* 'is-active' class puts this modal on top of the todo */}
        {/* <div className="modal overlay is-active">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div> */}
      </div>
    </>
  );
};
