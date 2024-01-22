import React, { useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  tempTodoTitle?: string;
  deletingTodoIds: number[];
  deleteTodo: (id: number) => void;
};

export const TodoList: React.FC<Props> = React.memo(({
  todos,
  tempTodoTitle,
  deletingTodoIds,
  deleteTodo,
}) => {
  const [selectedTodoId, setSelectedTodoId] = useState<number | null>(null);

  const handleDeleteTodo = (todoId: number) => {
    deleteTodo(todoId);
  };

  return (
    <section className="todoapp__main">
      {todos.map((todo, index) => {
        const { title, id, completed } = todo;

        return (
          <div
            key={id}
            className={cn(
              'todo',
              { completed },
            )}
            role="button"
            tabIndex={index}
            onDoubleClick={() => setSelectedTodoId(id)}
            onKeyUp={() => {}}
          >
            <label className="todo__status-label">
              <input
                type="checkbox"
                className="todo__status"
                checked={completed}
                onChange={() => {}}
              />
            </label>

            {selectedTodoId !== id ? (
              <span className="todo__title">{title}</span>
            ) : (
              <form>
                <input
                  type="text"
                  className="todo__title-field"
                  placeholder="Empty todo will be deleted"
                  value={title}
                />
              </form>
            )}

            <button
              type="button"
              className="todo__remove"
              onClick={() => handleDeleteTodo(id)}
            >
              ×
            </button>

            <div className={cn(
              'modal overlay',
              { 'is-active': deletingTodoIds.includes(id) },
            )}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        );
      })}

      {tempTodoTitle && (
        <div className="todo temp-item-enter temp-item-enter-active">
          <label className="todo__status-label">
            <input type="checkbox" className="todo__status" />
          </label>

          <span className="todo__title">{tempTodoTitle}</span>
          <button type="button" className="todo__remove">×</button>

          <div className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
});
