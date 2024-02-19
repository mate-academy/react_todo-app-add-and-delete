import React, { useEffect, useState } from 'react';
import cn from 'classnames';
import { TodoLoader } from '../TodoLoader/TodoLoader';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  onDelete?: (id: number) => void,
  deleteCompleted?: boolean,
  loading?: boolean,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete = () => {},
  deleteCompleted,
  loading,
}) => {
  const { id, title, completed } = todo;

  const [itemLoading, setItemLoading] = useState(false);

  useEffect(() => {
    if (!todo) {
      setItemLoading(true);
    }
  }, [todo]);

  useEffect(() => {
    if (deleteCompleted && completed) {
      setItemLoading(true);
      onDelete(id);
    }
  }, [deleteCompleted, completed, onDelete, id]);

  useEffect(() => {
    if (loading) {
      setItemLoading(true);
    }
  }, [loading]);

  const handleTodoDelete = () => {
    setItemLoading(true);
    onDelete(id);
    setTimeout(() => {
      setItemLoading(false);
    }, 1000);
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          value={title}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={handleTodoDelete}
      >
        ×
      </button>
      <TodoLoader
        itemLoading={itemLoading}
      />
    </div>
  );
};
