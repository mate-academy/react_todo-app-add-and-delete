import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[],
  setErrorMesage: (value: string) => void,
};

export const Main: React.FC<Props> = ({ todos, setErrorMesage }) => {
  return (
    <section className="todoapp__main">
      {
        todos.map(todo => (
          <div
            key={todo.id}
            className={classNames('todo', { completed: todo.completed })}
          >
            <label className="todo__status-label">
              <input
                type="checkbox"
                className="todo__status"
                checked={todo.completed}
                onChange={() => setErrorMesage('')}
              />
            </label>

            <span className="todo__title">{todo.title}</span>
            <button type="button" className="todo__remove">×</button>

            <div className="modal overlay">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        ))
      }
    </section>
  );
};
