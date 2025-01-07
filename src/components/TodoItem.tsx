/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';

interface TodoItemProps {
  todo: Todo;
  loadingTodoId: number | null;
  deleteTodo: (todoId: number) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  loadingTodoId,
  deleteTodo,
}) => (
  <div
    data-cy="Todo"
    className={classNames('todo', { completed: todo.completed })}
    key={todo.id}
  >
    <label htmlFor={`todo-checkbox-${todo.id}`} className="todo__status-label">
      <input
        id={`todo-checkbox-${todo.id}`}
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
      className={classNames('modal overlay', {
        'is-active': loadingTodoId === todo.id,
      })}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  </div>
);

export default TodoItem;
