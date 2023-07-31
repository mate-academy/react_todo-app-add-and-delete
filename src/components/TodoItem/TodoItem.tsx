import classNames from 'classnames';
import React, { useState } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todo?: Todo;
  tempTodo?: Todo;
  deleteIds?: number[];
  deleteTodo?: (todoId: number) => Promise<void>;
};
export const TodoItem: React.FC<Props> = (
  {
    todo,
    tempTodo,
    deleteIds,
    deleteTodo,
  },
) => {
  const [editing] = useState(false);
  // const [isDeleting, setIsDeleting] = useState(false);

  // if (todo?.id === deleteIds) {
  //   setIsDeleting(true);
  // } else {
  //   setIsDeleting(false);
  // };

  const deleteTodoHandler = () => {
    if (deleteTodo && todo) {
      deleteTodo(todo.id);
    }
  };

  return (
    <div
      className={classNames('todo', {
        completed: todo?.completed,
      })}
      key={todo?.id || tempTodo?.id}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo?.completed || tempTodo?.completed}
          onChange={() => { }}
        />
      </label>

      {!editing ? (
        <>
          <span className="todo__title">
            {
              todo?.title || tempTodo?.title
            }
          </span>
          <button
            type="button"
            className="todo__remove"
            onClick={deleteTodoHandler}
          >
            ×
          </button>
        </>

      ) : (
        <form>
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value="Todo is being edited now"
          />
        </form>
      )}
      {/* overlay will cover the todo while it is being updated */}
      <div
        className={
          classNames('modal overlay', {
            'is-active': tempTodo
              || (todo?.id && deleteIds?.includes(todo?.id)),
          })
        }
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
