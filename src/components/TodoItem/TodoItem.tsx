/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext } from 'react';
import cn from 'classnames';

import { Todo } from '../../types/Todo';
import { TodosContext } from '../TodoContext/TodoContext';

type Props = {
  todo: Todo;
  isProcessed: boolean;
};

export const TodoItem: React.FC<Props> = ({ todo, isProcessed }) => {
  const { removeTodo } = useContext(TodosContext);

  return (
    <div
      className={cn('todo', {
        completed: todo.completed,
      })}
      data-cy="Todo"
    >

      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => removeTodo(todo.id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', { 'is-active': isProcessed })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
