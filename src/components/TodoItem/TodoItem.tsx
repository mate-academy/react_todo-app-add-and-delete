/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import cn from 'classnames';

import { Todo } from '../../types/Todo';
import { TodoLoader } from '../TodoLoader';

type Props = {
  todo: Todo;
  handleDeleteTodo: (id: number) => void;
  handleToggleTodoCompleted: (id: number) => void;
  loadingTodoId: number | null;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  handleDeleteTodo,
  handleToggleTodoCompleted,
  loadingTodoId,
}) => {
  const { id, title, completed } = todo;

  return (
    <div
      key={id}
      data-cy="Todo"
      className={cn('todo', { completed: completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => handleToggleTodoCompleted(id)}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => handleDeleteTodo(id)}
      >
        ×
      </button>

      <TodoLoader id={id} loadingTodoId={loadingTodoId} />
    </div>
  );
};
