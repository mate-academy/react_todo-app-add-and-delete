import classNames from 'classnames';
import React, { memo } from 'react';
import './TodoList.scss';
import { Todo } from '../../types/Todo';

export type Props = {
  todos: Todo[]
  deleteTodoFromData: (value: number) => void
  temporaryTodo: Todo | null
  deleteTodo: number[]
};

export const TodoList: React.FC<Props> = memo(({
  todos,
  deleteTodoFromData,
  temporaryTodo,
  deleteTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <div
          data-cy="Todo"
          key={todo.id}
          className={classNames('todo',
            { completed: todo.completed === true })}
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
            />
          </label>

          <span
            data-cy="TodoTitle"
            className="todo__title"
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDeleteButton"
            onClick={() => deleteTodoFromData(todo.id)}
          >
            ×
          </button>
          {deleteTodo.includes(todo.id) && (
            <div data-cy="TodoLoader" className="modal overlay is-active">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          )}
        </div>
      ))}
      {temporaryTodo
        && (
          <div
            data-cy="Todo"
            className="todo"
          >
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
              />
            </label>

            <span
              data-cy="TodoTitle"
              className="todo__title"
            >
              {temporaryTodo.title}
            </span>
            <div data-cy="TodoLoader" className="modal overlay is-active">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        )}
    </section>
  );
});
