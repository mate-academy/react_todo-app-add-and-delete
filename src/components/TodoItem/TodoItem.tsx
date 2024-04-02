import React, { useState } from 'react';
import { TodoStatus } from '../../types/TodoStatus';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { TodoItemLoader } from '../TodoItemLoader';

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const [status] = useState<TodoStatus>(TodoStatus.Default);
  // useState here is only a placeholder for next part of task.

  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
      <div className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
        />
      </div>

      {status === TodoStatus.Editing ? (
        <form>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value="Todo is being edited now"
          />
        </form>
      ) : (
        <>
          <span data-cy="TodoTitle" className="todo__title">
            {todo.title}
          </span>

          <button type="button" className="todo__remove" data-cy="TodoDelete">
            ×
          </button>
        </>
      )}

      <TodoItemLoader isActive={status === TodoStatus.Loading} />
    </div>
  );
};
