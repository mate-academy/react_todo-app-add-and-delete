import React, { useContext, useEffect, useState } from 'react';
import cn from 'classnames';

import { TodoItemType } from '../../types/TodoItemType';
import { TodoListContext } from '../../contexts/TodoListContext';
import { TodoLoader } from '../TodoLoader/TodoLoader';

export const TodoItem: React.FC<TodoItemType> = ({ todo, tempTodo }) => {
  const { id, title, completed } = todo;
  const { deleteTodo } = useContext(TodoListContext);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (tempTodo) {
      setLoading(true);
    }
  }, [tempTodo]);

  const handlerDeleteTodo = () => {
    setLoading(true);
    deleteTodo(id);
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: completed,
      })}
    >
      <label className="todo__status-label">
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <input
          id="status"
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked={completed}
        />
      </label>
      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>
      {/* Remove button appears only on hover */}
      <button
        onClick={handlerDeleteTodo}
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being deleted or updated */}
      <TodoLoader isLoading={loading} />
    </div>
  );
};
