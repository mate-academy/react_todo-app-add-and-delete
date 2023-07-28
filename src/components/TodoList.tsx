import React from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[],
  onDelete: (todoId: number) => void,
  isDeleted: number | null;
  isLoading: boolean,
  title: string,
};

export const AppList: React.FC<Props> = ({
  todos,
  onDelete,
  isDeleted,
  isLoading,
  title,
}) => {
  const handleDelete = (todoId: number) => {
    onDelete(todoId);
  };

  return (
    <section className="todoapp__main">
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <div className={`todo ${todo.completed ? 'completed' : ''}`}>
              <label className="todo__status-label">
                <input
                  type="checkbox"
                  className="todo__status"
                />
              </label>

              <span className="todo__title">
                {todo.title}
              </span>
              <button
                type="button"
                className="todo__remove"
                onClick={() => handleDelete(todo.id)}
              >
                ×
              </button>
              <div className={`modal overlay ${todo.id === isDeleted ? 'is-active' : ''}`}>
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          </CSSTransition>
        ))}

        {isLoading && (
          <CSSTransition
            key="loading"
            timeout={300}
            classNames="temp-item"
          >
            <div className="todo">
              <label className="todo__status-label">
                <input type="checkbox" className="todo__status" />
              </label>

              <span className="todo__title">{title}</span>
              <button type="button" className="todo__remove">×</button>

              <div className="modal overlay is-active">
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
