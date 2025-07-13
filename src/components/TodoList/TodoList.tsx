/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { Todo } from '../../types/Todo';
import { Filter } from '../../types/Filter';
import classNames from 'classnames';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

type Props = {
  todos: Todo[];
  filter: Filter;
  tempTodo: Todo | null;
  onDelete: (id: number) => void;
  loading: boolean;
  deletingTodos: number[];
};

export const TodoList: React.FC<Props> = ({
  todos,
  filter,
  tempTodo,
  onDelete,
  loading,
  deletingTodos,
}) => {
  const visibleTodos = todos.filter(todo => {
    switch (filter) {
      case Filter.Active:
        return !todo.completed;
      case Filter.Completed:
        return todo.completed;
      default:
        return true;
    }
  });

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {visibleTodos.map(todo => (
          <CSSTransition key={todo.id} timeout={300} classNames="item">
            <div
              key={todo.id}
              data-cy="Todo"
              className={classNames('todo', {
                completed: todo.completed,
                loading: deletingTodos.includes(todo.id),
              })}
            >
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                  checked={todo.completed}
                  disabled={deletingTodos.includes(todo.id)}
                />
              </label>

              <span data-cy="TodoTitle" className="todo__title">
                {todo.title}
              </span>

              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
                onClick={() => onDelete(todo.id)}
                disabled={deletingTodos.includes(todo.id)}
              >
                ×
              </button>

              <div
                data-cy="TodoLoader"
                className={classNames('modal', 'overlay', {
                  'is-active': deletingTodos.includes(todo.id),
                })}
              >
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          </CSSTransition>
        ))}

        {tempTodo && (
          <CSSTransition key={0} timeout={300} classNames="temp-item">
            <div data-cy="Todo" className="todo">
              <label className="todo__status-label">
                <input
                  type="checkbox"
                  className="todo__status"
                  checked={false}
                  disabled
                />
              </label>

              <span className="todo__title" data-cy="TodoTitle">
                {tempTodo.title}
              </span>
              <button type="button" className="todo__remove" disabled>
                ×
              </button>

              <div
                data-cy="TodoLoader"
                className={classNames('modal', 'overlay', {
                  'is-active': loading,
                })}
              />
            </div>
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
