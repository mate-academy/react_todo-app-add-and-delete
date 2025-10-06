import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';
import classNames from 'classnames';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  loadingTodoId: number | null;
  onDelete: (id: number) => void;
  onToggle: (todo: Todo) => void;
}

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  loadingTodoId,
  onDelete,
  onToggle,
}) => (
  <ul className="todoapp__list" data-cy="TodoList">
    {todos.map(todo => (
      <TodoItem
        key={todo.id}
        todo={todo}
        loading={loadingTodoId === todo.id}
        onDelete={onDelete}
        onToggle={onToggle}
      />
    ))}

    {tempTodo && (
      <li
        className={classNames('todo', { completed: tempTodo.completed })}
        data-cy="Todo"
      >
        <label className="todo__status-label">
          <input
            type="checkbox"
            className="todo__status"
            data-cy="TodoStatus"
            checked={tempTodo.completed}
            readOnly
            aria-label="Temporary todo status"
          />
        </label>

        <span data-cy="TodoTitle" className="todo__title">
          {tempTodo.title}
        </span>

        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          disabled
        >
          ×
        </button>

        <div
          data-cy="TodoLoader"
          className={classNames('modal overlay', {
            'is-active': tempTodo !== null,
          })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </li>
    )}
  </ul>
);
