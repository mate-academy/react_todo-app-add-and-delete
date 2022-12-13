import classNames from 'classnames';
import React from 'react';
import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';

import { Todo, TodoTitle } from '../../types/Todo';

type Props = {
  todos: Todo[],
  changeTodo: (todoId: number, object: TodoTitle) => void
  removeTodo: (todoId: number) => void
  deletingLoader: number[],
  loaderVisibility: number,
  changeAllTodos: number[]
};

export const TodoList: React.FC<Props> = ({
  todos,
  changeTodo,
  removeTodo,
  deletingLoader: isDeleting,
  loaderVisibility,
  changeAllTodos: isChangeAllTodos,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <div
              key={todo.id}
              data-cy="Todo"
              className={classNames('todo',
                { 'todo completed': todo.completed })}
            >
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                  onChange={() => {
                    changeTodo(todo.id, { completed: !todo.completed });
                  }}
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
                onClick={() => removeTodo(todo.id)}
              >
                ×
              </button>

              <div
                data-cy="TodoLoader"
                className={classNames(
                  'modal overlay',
                  {
                    'is-active': isDeleting.includes(todo.id)
                      || isChangeAllTodos.includes(todo.id)
                      || loaderVisibility === todo.id
                      || todo.id === 0,
                  },
                )}

              >
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          </CSSTransition>
        ))}
      </TransitionGroup>
    </section>
  );
};
