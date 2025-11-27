/* eslint-disable jsx-a11y/label-has-associated-control */
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { TodoComponent } from './TodoComponent';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import React from 'react';

type Props = {
  todos: Todo[];
  visibleTodos: Todo[];
  onCheck: (updater: (prevTodos: Todo[]) => Todo[]) => void;
  onDelete: (todo: Todo[]) => void;
  tempTodo: Todo | null;
  completedTodos: number[] | null;
};

export const TodoList: React.FC<Props> = React.memo(
  ({ todos, visibleTodos, onCheck, onDelete, tempTodo, completedTodos }) => {
    return (
      <section className="todoapp__main" data-cy="TodoList">
        <TransitionGroup>
          {todos &&
            visibleTodos.map(todo => (
              <CSSTransition key={todo.id} timeout={300} classNames={'item'}>
                <TodoComponent
                  key={todo.id}
                  todo={todo}
                  onCheck={onCheck}
                  onDelete={onDelete}
                  completedTodos={completedTodos}
                />
              </CSSTransition>
            ))}
          {tempTodo && (
            <CSSTransition
              key={tempTodo.id}
              timeout={300}
              classNames={'temp-item'}
            >
              <div
                data-cy="Todo"
                className={classNames('todo', {
                  completed: tempTodo.completed,
                })}
              >
                <label className="todo__status-label">
                  <input
                    data-cy="TodoStatus"
                    type="checkbox"
                    className="todo__status"
                    checked={tempTodo.completed}
                    onChange={() => {
                      onCheck((prevTodos: Todo[]) =>
                        prevTodos.map(item =>
                          item.id === tempTodo.id
                            ? { ...item, completed: !item.completed }
                            : item,
                        ),
                      );
                    }}
                  />
                </label>

                <span data-cy="TodoTitle" className="todo__title">
                  {tempTodo.title}
                </span>

                {/* Remove button appears only on hover */}
                <button
                  type="button"
                  className="todo__remove"
                  data-cy="TodoDelete"
                  onClick={() => onDelete([tempTodo])}
                >
                  ×
                </button>

                {/* overlay will cover the todo while it is being deleted or updated */}
                <div data-cy="TodoLoader" className="modal overlay is-active">
                  <div className="modal-background has-background-white-ter" />
                  <div className="loader" />
                </div>
              </div>
            </CSSTransition>
          )}
        </TransitionGroup>
      </section>
    );
  },
);

TodoList.displayName = 'TodoList';
