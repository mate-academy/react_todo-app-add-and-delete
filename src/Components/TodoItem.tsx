import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  deleteTodo?:(value:number) => void;
  isLoading?: boolean;
  idToDelete?:number[];
};

export const TodoItem: React.FC<Props> = ({
  todo,
  deleteTodo = () => {},
  isLoading,
  idToDelete,
}) => {
  return (
    <div
      className={classNames('todo',
        { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          defaultChecked={todo.completed}
        />
      </label>

      <span className="todo__title">{todo.title}</span>
      <button
        type="button"
        className="todo__remove"
        onClick={() => deleteTodo(todo.id)}
      >
        ×
      </button>

      {false && (
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
      <div className={
        classNames('modal overlay',
          { 'is-active': isLoading || idToDelete?.includes(todo.id) })
      }
      >
        <div className="modal-background has-background-white-ter " />
        <div className="loader" />
      </div>
    </div>
  );
};
