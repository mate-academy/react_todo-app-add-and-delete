import React from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  todosLoadingState: Todo[],
  onClickRemoveTodo: (todoId: Todo) => void,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onClickRemoveTodo,
  todosLoadingState,
}) => {
  const hasLoadingState = todosLoadingState
    .some(todoLoading => todoLoading.id === todo.id);
  const isLoading = todo.id === 0 || hasLoadingState;

  return (
    <div
      className={cn('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          defaultChecked={todo.completed}
        />
      </label>

      {/* This form is shown instead of the title and remove button */}
      {/* <form>
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value="Todo is being edited now"
          />
        </form> */}

      <span className="todo__title">{todo.title}</span>
      {/* Remove button appears only on hover */}
      <button
        type="button"
        className="todo__remove"
        onClick={() => onClickRemoveTodo(todo)}
      >
        ×
      </button>

      {/* 'is-active' class puts this modal on top of the todo */}
      <div
        className={cn('modal overlay', {
          'is-active': isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
