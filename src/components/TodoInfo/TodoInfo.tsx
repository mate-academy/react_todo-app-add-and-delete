import React, { useState, memo } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo,
  deleteTodo: (todoId: number) => void;
  isNewTodoLoading?: boolean
}

export const TodoInfo:React.FC<Props> = memo(({
  todo,
  deleteTodo,
  isNewTodoLoading,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteTodo = async () => {
    setIsLoading(true);

    await deleteTodo(todo.id);

    setIsLoading(false);
  };

  return (
    <div
      key={todo.id}
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
          defaultChecked
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">{todo.title}</span>
      <button
        data-cy="TodoDeleteButton"
        type="button"
        className="todo__remove"
        onClick={handleDeleteTodo}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isLoading || isNewTodoLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});
