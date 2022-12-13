import classNames from 'classnames';
import React from 'react';

import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';

import { Todo, TodoTitle } from '../../types/Todo';

type Props = {
  todos: Todo[],
  removeTodo: (todoId: number) => void,
  changeTodo: (todoId: number, object: TodoTitle) => void,
  loader: number,
  loaderDeleating: number[],
  loaderAllTodos: number[],
};

export const TodoList: React.FC<Props> = ({
  todos,
  changeTodo,
  removeTodo,
  loader,
  loaderDeleating,
  loaderAllTodos,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map(todo => {
          const loaderVisibility: boolean = loaderDeleating.includes(todo.id)
            || loaderAllTodos.includes(todo.id)
            || loader === todo.id
            || todo.id === 0;

          return (
            <CSSTransition
              key={todo.id}
              timeout={300}
              classNames="item"
            >
              <div
                data-cy="Todo"
                className={classNames('todo', {
                  'todo completed': todo.completed,
                })}
                key={todo.id}
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

                <span data-cy="TodoTitle" className="todo__title">
                  {todo.title}
                </span>
                <button
                  type="button"
                  className="todo__remove"
                  data-cy="TodoDeleteButton"
                  onClick={() => {
                    removeTodo(todo.id);
                  }}
                >
                  ×
                </button>

                <div
                  data-cy="TodoLoader"
                  className={classNames('modal', 'overlay', {
                    'is-active': loaderVisibility,
                  })}
                >
                  <div className="modal-background has-background-white-ter" />
                  <div className="loader" />
                </div>
              </div>
            </CSSTransition>
          );
        })}
      </TransitionGroup>
    </section>
  );
};
