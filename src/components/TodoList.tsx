import React, { useEffect, useRef } from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';

type Props = {
  todos: Todo[];
  isEditingTodo: Todo | null;
  setIsEditingTodo: (todo: Todo | null) => void;
  handleCompletedStatus: (id: number) => void;
};

export const TodoList: React.FC<Props> = React.memo(function TodoList({
  todos,
  isEditingTodo,
  setIsEditingTodo,
  handleCompletedStatus,
}) {
  const todoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (todoField.current && isEditingTodo) {
      todoField.current.focus();
    }
  }, [isEditingTodo]);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <div
          data-cy="Todo"
          className={classNames('todo', { completed: todo.completed })}
          key={todo.id}
        >
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={todo.completed}
              onChange={() => handleCompletedStatus(todo.id)}
            />
          </label>

          {isEditingTodo?.id === todo.id ? (
            <form>
              <input
                data-cy="TodoTitleField"
                type="text"
                className="todo__title-field"
                placeholder="Empty todo will be deleted"
                value={isEditingTodo.title}
                onChange={e =>
                  setIsEditingTodo({ ...todo, title: e.target.value })
                }
                onBlur={() => setIsEditingTodo(null)}
                ref={todoField}
              />
            </form>
          ) : (
            <>
              <span
                data-cy="TodoTitle"
                className="todo__title"
                onDoubleClick={() => setIsEditingTodo(todo)}
              >
                {todo.title}
              </span>

              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
              >
                ×
              </button>
            </>
          )}

          {/* overlay will cover the todo while it is being deleted or updated */}
          {/* when todo is in loadind state 'is-active' class puts this modal on top of the todo */}
          <div data-cy="TodoLoader" className="modal overlay">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}
    </section>
  );
});
