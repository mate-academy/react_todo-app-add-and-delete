import React from 'react';
import { Todo } from '../types/Todo';

interface TodoItemProps {
  todo: Todo;
  loadingTodoIds: number[] | [];
  handleDelete: (id: number) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  loadingTodoIds,
  handleDelete,
}) => {
  return (
    <>
      <div
        data-cy="Todo"
        className={`todo ${todo.completed && 'completed'}`}
        key={todo.id}
      >
        <label className="todo__status-label" htmlFor={`todo-${todo.id}`}>
          {
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={todo.completed}
            />
          }
        </label>

        <span data-cy="TodoTitle" className="todo__title">
          {todo.title}
        </span>
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => {
            handleDelete(todo.id);
          }}
        >
          ×
        </button>

        <div
          data-cy="TodoLoader"
          className={`modal overlay ${loadingTodoIds?.some(t => t === todo.id) ? 'is-active' : ''}`}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>

      {/* This todo is being edited */}
      {/* <div data-cy="Todo" className="todo">
                <label className="todo__status-label">
                  <input
                    data-cy="TodoStatus"
                    type="checkbox"
                    className="todo__status"
                  />
                </label> */}

      {/* This form is shown instead of the title and remove button */}
      {/* <form>
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
              </div> */}
    </>
  );
};
