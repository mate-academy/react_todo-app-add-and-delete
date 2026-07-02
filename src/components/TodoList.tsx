import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type TodoListProps = {
  deleting: number[];
  onDelete: (id: number) => void;
  visibleTodos: Todo[];
};

export const TodoList: React.FC<TodoListProps> = ({
  deleting,
  onDelete,
  visibleTodos,
}) => {
  return (
    <div>
      {visibleTodos.map(todo => (
        <div
          data-cy="Todo"
          key={todo.id}
          className={classNames('todo', {
            completed: todo.completed,
          })}
        >
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={todo.completed}
            readOnly
          />
          <span data-cy="TodoTitle" className="todo__title">
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete(todo.id)}
          >
            ×
          </button>
          <div
            data-cy="TodoLoader"
            className={classNames('modal overlay', {
              'is-active': deleting.includes(todo.id),
            })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}
    </div>
  );
};
