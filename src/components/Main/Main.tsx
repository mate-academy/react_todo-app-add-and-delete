import React from 'react';
import classNames from 'classnames';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Todo } from '../../types/Todo';

interface Props {
  todos: Todo[],
  deleteTodo: (id: number) => void,
  onUpdate: (id: number) => void,
}

export const Main: React.FC<Props> = ({
  todos,
  deleteTodo,
  onUpdate,
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
              className={classNames(
                'todo',
                { completed: todo.completed },
              )}
            >
              <label className="todo__status-label">
                <input
                  type="checkbox"
                  className="todo__status"
                  data-sy="TodoStatus"
                  checked={todo.completed}
                  onChange={() => onUpdate(todo.id)}
                />
              </label>

              <span className="todo__title">{todo.title}</span>

              <button
                type="button"
                className="todo__remove"
                onClick={() => deleteTodo(todo.id)}
              >
                ×
              </button>

              <div className={classNames('modal overlay')}>
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
