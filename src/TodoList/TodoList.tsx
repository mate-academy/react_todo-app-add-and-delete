/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { getFilteredTodos } from '../components/filteredTodos';
import { Todo } from '../types/Todo';
import { FilterTypes } from '../types/filterTypes';
import classNames from 'classnames';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

interface TodoListProps {
  todos: Todo[];
  filter: FilterTypes;
  deleteTodo: (todoId: number) => void;
  fakeTodo: Todo | null;
  isLoading: boolean;
}
export const TodoList: React.FC<TodoListProps> = ({
  todos,
  filter,
  deleteTodo,
  fakeTodo,
  isLoading,
}) => {
  const filteredTodos = getFilteredTodos(todos, filter);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {filteredTodos.map(todo => (
          <CSSTransition key={todo.id} timeout={300} classNames="item">
            <div
              data-cy="Todo"
              className={classNames('todo', { completed: todo.completed })}
            >
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                  checked={todo.completed}
                />
              </label>
              <span data-cy="TodoTitle" className="todo__title">
                {todo.title}
              </span>
              {/* Remove button appears only on hover */}
              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
                onClick={() => deleteTodo(todo.id)}
              >
                ×
              </button>
              <div
                data-cy="TodoLoader"
                className={classNames('modal overlay', {
                  'is-active': isLoading,
                })}
              >
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          </CSSTransition>
        ))}
        {fakeTodo && (
          <CSSTransition key={0} timeout={300} classNames="temp-item">
            <div
              data-cy="Todo"
              className={classNames('todo', { completed: fakeTodo.completed })}
            >
              <div
                data-cy="Todo"
                className={classNames('todo', {
                  completed: fakeTodo.completed,
                })}
              >
                <label className="todo__status-label">
                  <input
                    data-cy="TodoStatus"
                    type="checkbox"
                    className="todo__status"
                    checked={fakeTodo.completed}
                  />
                </label>
                <span data-cy="TodoTitle" className="todo__title">
                  {fakeTodo.title}
                </span>
                <button
                  type="button"
                  className="todo__remove"
                  data-cy="TodoDelete"
                  onClick={() => deleteTodo(fakeTodo.id)}
                >
                  ×
                </button>
              </div>
            </div>
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
