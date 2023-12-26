import React, { useContext } from 'react';
import cn from 'classnames';

import { Todo } from '../types/Todo';
import { AppContext } from '../AppContext';

interface Props {
  todo: Todo;
}

export const TodoItem: React.FC<Props> = React.memo((props) => {
  const { todo } = props;
  const {
    deleteTodo,
    selectedTodoIds,
  } = useContext(AppContext);

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: todo.completed,
      })}
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
        onClick={() => deleteTodo(todo.id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': selectedTodoIds.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});
