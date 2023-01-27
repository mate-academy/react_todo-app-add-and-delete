import React, { memo, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { Loader } from '../Loader/Loader';

interface Props {
  todo: Todo,
  onTodoDelete: (todoId: number) => void;
}

export const TodoItem: React.FC<Props> = memo(({
  todo,
  onTodoDelete,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteTodo = async () => {
    setIsDeleting(true);

    await onTodoDelete(todo.id);

    setIsDeleting(false);
  };

  return (
    <div
      key={todo.id}
      data-cy="Todo"
      className={cn('todo',
        { completed: todo.completed })}
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
        data-cy="TodoDeleteButton"
        onClick={handleDeleteTodo}
      >
        ×
      </button>

      <Loader isLoading={isDeleting} />

    </div>
  );
});
