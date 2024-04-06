import { TodoStatus } from '../../types/TodoStatus';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { TodoItemLoader } from '../TodoItemLoader';
import React, { useState } from 'react';

type Props = {
  todo: Todo;
  startingStatus?: TodoStatus;
  onTodoDelete: (id: number) => void;
  onTodoCheck: (todo: Todo) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  startingStatus = TodoStatus.Default,
  onTodoDelete,
  onTodoCheck,
}) => {
  const [status, setStatus] = useState(startingStatus);

  const handleTodoDelete = () => {
    setStatus(TodoStatus.Loading);

    onTodoDelete(todo.id);
  };

  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
      <div
        onClick={() => {
          onTodoCheck(todo);
        }}
        className="todo__status-label"
      >
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

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleTodoDelete()}
          >
            ×
          </button>
        </>
      )}

      <TodoItemLoader isActive={status === TodoStatus.Loading} />
    </div>
  );
};
