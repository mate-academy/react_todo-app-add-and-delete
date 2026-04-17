import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  visibleTodos: Todo[];
  loading: boolean;
  onToggleTodo: (id: number) => void;
  onDeleteTodo: (id: number) => void;
  tempTodo?: Todo | null;
  processings: number[];
};

export const MainSection: React.FC<Props> = ({
  visibleTodos,
  loading,
  onToggleTodo,
  onDeleteTodo,
  tempTodo = null,
  processings,
}) => {
  return (
    <section
      className={classNames('todoapp__main', {
        hidden: visibleTodos.length === 0 && !tempTodo,
      })}
      data-cy="TodoList"
    >
      {visibleTodos.map(todo => {
        const isProcessing = processings.includes(todo.id);

        return (
          <div
            key={todo.id}
            data-cy="Todo"
            className={classNames('todo', { completed: todo.completed })}
          >
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                checked={todo.completed}
                onChange={() => onToggleTodo(todo.id)}
                disabled={loading || isProcessing || Boolean(tempTodo)}
                aria-label={`Mark "${todo.title}" as ${todo.completed ? 'incomplete' : 'complete'}`}
              />
            </label>
            <span data-cy="TodoTitle" className="todo__title">
              {todo.title}
            </span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => onDeleteTodo(todo.id)}
              disabled={loading || isProcessing || Boolean(tempTodo)}
            >
              ×
            </button>
            <div
              data-cy="TodoLoader"
              className={classNames('modal overlay', {
                'is-active': isProcessing,
              })}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        );
      })}

      {tempTodo && (
        <div
          key="temp"
          data-cy="Todo"
          className={classNames('todo', { completed: tempTodo.completed })}
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={tempTodo.completed}
              onChange={() => {}}
              disabled
              aria-label="Loading todo"
            />
          </label>
          <span data-cy="TodoTitle" className="todo__title">
            {tempTodo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => {}}
            disabled
          >
            ×
          </button>
          <div
            data-cy="TodoLoader"
            className={classNames('modal overlay', {
              'is-active': true,
            })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
