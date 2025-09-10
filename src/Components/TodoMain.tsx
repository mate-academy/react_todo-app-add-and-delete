import cn from 'classnames';
import { Todo } from '../types/Todo';
import React from 'react';
import '../styles/animation.scss';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

type Props = {
  visibleTodos: Todo[];
  tempTodo: Todo | null;
  onDelete: (id: number) => void;
  deletingIds: Set<number>;
};

export const TodoMain: React.FC<Props> = React.memo(
  ({ visibleTodos, tempTodo, onDelete, deletingIds }) => {
    return (
      <section className="todoapp__main" data-cy="TodoList">
        <TransitionGroup>
          {visibleTodos.map(todo => (
            <CSSTransition key={todo.id} timeout={300} classNames="item">
              <div
                key={todo.id}
                data-cy="Todo"
                className={cn('todo', {
                  completed: todo.completed,
                })}
              >
                <label className="todo__status-label">
                  <input
                    data-cy="TodoStatus"
                    type="checkbox"
                    className="todo__status"
                    checked={todo.completed}
                  />
                  {}
                </label>

                <span data-cy="TodoTitle" className="todo__title">
                  {todo.title}
                </span>
                <button
                  type="button"
                  className="todo__remove"
                  onClick={() => onDelete(todo.id)}
                  data-cy="TodoDelete"
                >
                  ×
                </button>

                <div
                  data-cy="TodoLoader"
                  className={cn('modal overlay', {
                    'is-active': deletingIds.has(todo.id),
                  })}
                >
                  <div className="modal-background has-background-white-ter" />
                  <div className="loader" />
                </div>
              </div>
            </CSSTransition>
          ))}
        </TransitionGroup>

        {tempTodo && (
          <div
            key={tempTodo.id}
            data-cy="Todo"
            className={cn('todo', {
              completed: tempTodo.completed,
            })}
          >
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                checked={tempTodo.completed}
                disabled
              />
              {}
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

            <div data-cy="TodoLoader" className="modal overlay is-active">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        )}
      </section>
    );
  },
);

TodoMain.displayName = 'TodoMain';
