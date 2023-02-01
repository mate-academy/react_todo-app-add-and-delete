import classNames from 'classnames';
import React, { memo, useState } from 'react';
import { Todo } from '../../types/Todo';
import { Loader } from '../Loader/Loader';

type Props = {
  todo: Todo,
  onTodoDelete?: (selectedTodoId: number) => void,
  loadingTodosIds?: number[],
};

export const TodoItem: React.FC<Props> = memo(({
  todo,
  onTodoDelete,
  loadingTodosIds,
}) => {
  const [isTodoDeleted, setIsTodoDeleted] = useState(false);

  const handleDeletedTodo = () => {
    setIsTodoDeleted(true);

    if (onTodoDelete) {
      onTodoDelete(todo.id);
    }
  };

  const isLoaderNeeded = todo.id === 0
    || isTodoDeleted
    || loadingTodosIds?.includes(todo.id);

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
          defaultChecked
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={handleDeletedTodo}
      >
        ×
      </button>

      {isLoaderNeeded && <Loader />}
    </div>
  );
});
