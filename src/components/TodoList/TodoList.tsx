import classNames from 'classnames';
import React from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TempTodo } from '../TempTodo';
import '../../styles/transitions.scss';

interface Props {
  todos: Todo[],
  removeTodo: (todoId: number) => void;
  loadingTodo: number[];
  tempTodo: Todo | null;
}

export const TodoList: React.FC<Props> = ({
  todos,
  removeTodo,
  loadingTodo,
  tempTodo,
}) => {
  return (
    <section className="todoapp__main">
      <TransitionGroup>
        {todos.map((todo) => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <div
              className={classNames('todo',
                { completed: todo.completed })}
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
                onClick={() => todo.id && removeTodo(todo.id)}
              >
                ×
              </button>

              <div className={classNames('modal overlay',
                {
                  'is-active': todo.id !== undefined
                && loadingTodo.includes(todo.id),
                })}
              >
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          </CSSTransition>
        ))}

        {tempTodo && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="temp-item"
          >
            <TempTodo todo={tempTodo} />

          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
