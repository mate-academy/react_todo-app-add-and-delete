import React from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  visibleTodos: Todo[],
  onRemoveTodo: (todo: Todo, index: number) => void
  tempTodo: Todo | null | undefined,
  indexUpdatedTodo: number;
};

export const Main: React.FC<Props> = ({
  visibleTodos,
  onRemoveTodo,
  tempTodo,
  indexUpdatedTodo,
}) => {
  return (
    <section className="todoapp__main">
      {visibleTodos.map((todo, index) => {
        if (tempTodo && index === indexUpdatedTodo) {
          return (
            <div className="todo" key={todo.id}>
              <label className="todo__status-label">
                <input type="checkbox" className="todo__status" />
              </label>

              <span className="todo__title">{tempTodo.title}</span>
              <button
                type="button"
                className="todo__remove"
              >
                ×
              </button>

              <div className="modal overlay is-active">
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          );
        }

        return (
          <div
            className={cn(
              'todo',
              { completed: todo.completed },
            )}
            key={todo.id}
          >
            <label className="todo__status-label">
              <input
                type="checkbox"
                className="todo__status"
              />
            </label>

            <span className="todo__title">{todo.title}</span>
            <button
              type="button"
              className="todo__remove"
              onClick={() => onRemoveTodo(todo, index)}
            >
              ×
            </button>

            <div className="modal overlay">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        );
      })}
    </section>
  );
};
