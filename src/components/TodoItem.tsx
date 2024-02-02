/* eslint-disable max-len */
/* eslint-disable no-console */
/* eslint-disable import/no-cycle */

import classNames from 'classnames';
import { useContext, useState } from 'react';
import { TodoContext } from '../TodoContext';
import { Todo, TodoContextProps } from '../types/interfaces';

interface ItemProps {
  todo: Todo
}

export const TodoItem: React.FC<ItemProps> = ({ todo }) => {
  const { handleCheck, handleDeleteTodo } = useContext(TodoContext) as TodoContextProps;

  const [loading, setLoading] = useState(false);

  console.log(todo.id);
  const onClickHandler: React.MouseEventHandler<HTMLInputElement> = () => {
    setLoading(true);
    handleCheck(todo, setLoading);
  };

  const onDeleteTodo: React.MouseEventHandler<HTMLButtonElement> = () => {
    setLoading(true);
    handleDeleteTodo(todo, setLoading);
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo',
        { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onClick={onClickHandler}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      {/* Remove button appears only on hover */}
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={onDeleteTodo}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being updated */}

      <div data-cy="TodoLoader" className={classNames('modal', 'overlay', { 'is-active': loading || todo.id === 0 })}>
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>

    </div>
  );
};
